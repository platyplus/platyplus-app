import { Route } from 'vue-router'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'
import { ElementLoaderMixin } from './element-loader'
import { upsertMutation } from '../graphql'
import { get, set } from 'object-path'
import { RelationshipProperty, ColumnProperty } from '../schema/properties'
import { permittedFieldsOf } from '@casl/ability/extra'

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
    if (this.tableClass && this.formChanged) {
      const tableName = this.tableClass.name
      const variables: ObjectMap = { [tableName]: {} }
      // * Forces the primary key fields from the initial element, or set their default values
      for (const property of this.tableClass.idProperties) {
        set(
          variables,
          [tableName, property.name],
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
            set(variables, [tableName, column.name], this.form[column.name])
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
                  [tableName, map.from.name],
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
        variables: variables[tableName] || {}
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
   * * Returns true if any modification has been done in the form
   */
  public get formChanged(): boolean {
    // * Bourrin mais pour l'instant ça marche...
    return JSON.stringify(this.element) !== JSON.stringify(this.form)
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
