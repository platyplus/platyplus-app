import { Route } from 'vue-router'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { permittedFieldsOf } from '@casl/ability/extra'
import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'
import { ElementLoaderMixin } from './element-loader'
import { upsertMutation } from '../graphql'
import { get } from 'object-path'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

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
    if (this.tableClass && this.formChanged) {
      const variables = { ...this.form }
      // Forces the primary key fields from the initial element, or set their default values
      this.tableClass.idProperties.map(idProperty => {
        variables[idProperty.name] =
          this.element[idProperty.name] || idProperty.generateDefault()
      })
      const mutation = upsertMutation(
        this.tableClass,
        this.$ability,
        this.action
      )
      const result = await this.$apollo.mutate({
        mutation,
        variables
      })
      const data = get(result, `data.insert_${this.tableName}.returning.0`)
      // TODO catch the result? Update the cache? -> update the collection cache at least
      this.reset() // Reset is required to then check if any field changed in the beforeRouteLeave hook
      this.read(pick(data, this.tableClass.idColumnNames))
    }
  }

  // TODO
  public reset() {
    // TODO sort the following todos either in the 'reset' method (when the user can still modify the field) or in the 'save' method (when the user is not allowed to modify its value)
    // TODO set 'fixed' values from the route query e.g. query: {parent_id: '1234'} when creating a child org_unit
    // TODO set default values from the initial element
    // TODO set default values from the hasura permissions and from the backend schema
    // TODO set the possible 'object' or 'array' property values?
    // Copies the allowed fields from the initial element
    this.form = pick(
      this.element,
      permittedFieldsOf(this.$ability, this.action, this.tableName)
    )
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
    return Object.keys(this.form).some(
      field =>
        (!!this.element[field] && this.element[field]) !==
        (!!this.form[field] && this.form[field])
    )
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
