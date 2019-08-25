import { Route } from 'vue-router'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { permittedFieldsOf } from '@casl/ability/extra'
import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'
import { ElementLoaderMixin } from './element-loader'
import { upsertMutation } from '../graphql'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

@Component
export class FormManagerMixin extends Mixins(ElementLoaderMixin) {
  public form: ObjectMap = {}

  public get action() {
    return Object.keys(this.element).length > 0 ? 'update' : 'insert'
  }

  public async submit() {
    if (this.tableClass) {
      const mutation = upsertMutation(
        this.tableClass,
        this.$ability,
        this.action
      )
      await this.$apollo.mutate({
        mutation,
        variables: this.form
      })
      // TODO catch the result? Update the cache?
      this.read()
    }
  }

  // TODO
  public reset() {
    // TODO set default values from the initial element
    // TODO set default values from the hasura permissions and from the backend schema
    // TODO set the possible 'object' or 'array' property values?
    // Keeps only allowed fields
    this.form = pick(
      this.element,
      permittedFieldsOf(
        this.$ability,
        this.action,
        this.tableClass && this.tableClass.name
      )
    )
    this.tableClass &&
      this.tableClass.idColumnNames.map(idColumn => {
        this.form[idColumn] = this.element[idColumn] || 'DEFAULT' // TODO id default value
      })
  }

  public read() {
    this.$router.replace(this.$route.fullPath.replace('/edit', '/read'))
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
      if (!vm.$can('update', vm.element)) {
        console.log('cannot update') // TODO navigation guard
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteLeave(to: Route, from: Route, next: any) {
    console.log('Confirm leaving the page if modifications done') // TODO
    //* See https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    next()
  }
}
