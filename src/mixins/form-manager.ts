import { Route } from 'vue-router'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { permittedFieldsOf } from '@casl/ability/extra'
import { get, set } from 'object-path'

import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'
import { upsertMutation } from 'src/hasura/graphql'
import {
  RelationshipProperty,
  ColumnProperty
} from 'src/hasura/schema/properties'

import { ElementLoaderMixin } from './element-loader'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

interface VeeOberverComponent extends Element {
  validate: () => boolean
  reset: () => void
}

@Component
export class FormManagerMixin extends Mixins(ElementLoaderMixin) {
  public form: ObjectMap = {}

  public get action() {
    return this.isNew ? 'insert' : 'update'
  }

  public get canSave() {
    if (this.isNew) {
      return this.$can('insert', this.tableName)
    } else return this.$can('update', this.element)
  }

  public async submit() {
    // TODO revoir avec le nouveau systeme
    const validator = this.$refs.validator as VeeOberverComponent
    if (!!validator && !(await validator.validate())) return
    if (this.formChanged) {
      const variables: ObjectMap = { [this.tableName]: {} }
      // * Forces the primary key fields from the initial element, or set their default values
      for (const property of this.tableClass.idProperties) {
        set(
          variables,
          [this.tableName, property.name],
          this.element[property.name] || property.generateDefault()
        )
      }
      const permittedFields = permittedFieldsOf(
        this.$ability,
        this.action,
        this.tableName
      )
      for (const property of this.tableClass.properties) {
        if (property.isColumn) {
          // * Copies the non ID, non reference, permitted fields
          const column = property as ColumnProperty
          if (
            !column.isId &&
            !column.isReference &&
            permittedFields.includes(column.name)
          ) {
            set(
              variables,
              [this.tableName, column.name],
              this.form[column.name]
            )
          }
        } else {
          const relationship = property as RelationshipProperty
          if (relationship.isMultiple) {
            console.log('TODO multiple') // TODO
          } else {
            // TODO if the nested object changed, upsert it
            if (relationship.isOwnedByClass) {
              // TODO if the nested object changed and it is existing in this.element, delete it
              console.log('TODO: object owned by class')
            } else {
              // * Copies the foreign keys of the many-to-one relationships
              for (const map of relationship.mapping) {
                set(
                  variables,
                  [this.tableName, map.from.name],
                  get(this.form, `${relationship.name}.${map.to.name}`, null)
                )
              }
            }
          }
        }
      }
      console.log(variables)
      const mutation = upsertMutation(
        this.tableClass,
        this.$ability,
        this.action
      )
      const result = await this.$apollo.mutate({
        mutation,
        variables: variables[this.tableName] || {}
      })
      const data = get(result, `data.insert_${this.tableName}.returning.0`)
      // TODO catch the result? Update the cache? -> update the collection cache at least
      this.reset() // Reset is required to then check if any field changed in the beforeRouteLeave hook
      this.read(pick(data, this.tableClass.idColumnNames))
    } else this.read()
  }

  public reset() {
    // TODO sort the following todos either in the 'reset' method (when the user can still modify the field) or in the 'save' method (when the user is not allowed to modify its value)
    // TODO set 'fixed' values from the route query e.g. query: {parent_id: '1234'} when creating a child org_unit -> field component
    // TODO set default values from the initial element -> on save
    // TODO set default values from the hasura permissions and from the backend schema -> on save
    /**
     * Every field is checked with the user's ability before being added
     */
    // TODO complicated and not really usefull here to filter allowed fields.
    // TODO Do it at field validation level/save level
    // ! https://sam.beckham.io/wrote/deep-copying-and-the-immutability-issue.html
    this.form = JSON.parse(JSON.stringify(this.element))
    const validator = this.$refs.validator as VeeOberverComponent
    this.$nextTick(() => !!validator && validator.reset())
  }

  /**
   * Watches if the element has been loaded, so it can set the initial form.
   */
  @Watch('element')
  public onElementChanged() {
    this.reset()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteEnter(to: Route, from: Route, next: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next((vm: any) => {
      vm.reset()
      if (!vm.canSave) {
        console.log(`cannot ${vm.action}`) // TODO navigation guard insert + update
      }
    })
  }

  /**
   * * Returns the changes made in the form based on the initial element
   * ! The objects are compared with JSON.stringify, which requires a strict manipulation
   * TODO the many2many selected options are not correctly generated (returns all the columns instead of id + label columns)
   */
  public get changes(): ObjectMap {
    const newValue: ObjectMap = {}
    for (const property of this.fields(this.action)) {
      const name = property.name
      if (property.isColumn) {
        if (this.form[name] !== this.element[name])
          newValue[name] = this.form[name]
      } else {
        const relationship = property as RelationshipProperty
        if (relationship.isMultiple) {
          const oldArray = (this.element[name] || []) as ObjectMap[]
          const newArray = (this.form[name] || []) as ObjectMap[]
          const oldStrArray = oldArray.map(item => JSON.stringify(item))
          const newStrArray = newArray.map(item => JSON.stringify(item))
          const _add = newStrArray
            .filter(item => !oldStrArray.includes(item))
            .map(item => JSON.parse(item))
          const _remove = oldStrArray
            .filter(item => !newStrArray.includes(item))
            .map(item => JSON.parse(item))
          if (_add.length || _remove.length) {
            newValue[name] = { _add, _remove }
          }
        } else {
          if (
            JSON.stringify(this.element[name]) !==
            JSON.stringify(this.form[name])
          )
            newValue[name] = this.form[name]
        }
      }
    }
    return newValue
  }

  /**
   * * Returns true if any modification has been done in the form
   */
  public get formChanged(): boolean {
    return Object.keys(this.changes).length !== 0
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteLeave(to: Route, from: Route, next: any) {
    //* See https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    if (this.formChanged) {
      console.log('Confirm leaving the page if modifications done') // TODO
    }
    next()
  }
}
