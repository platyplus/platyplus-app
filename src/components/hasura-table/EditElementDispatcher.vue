<template lang="pug">
q-form(autofocus @reset="reset" @submit="submit")
  slot(name="before-fields" :element="element")
  slot(name="fields" :element="element")
    component(v-for="property, key in fields(action)"
      :key="'field-'+key"
      :is="componentName(property, 'h-edit-field')"
      :property="property"
      :element="element"
      :tableClass="property.class"
      v-model="form[propertyFieldName(property)]")
  slot(name="after-fields" :element="element")
  slot(name="before-actions" :element="element")
  slot(name="actions" :element="element")
    q-btn(v-if="$can('update', element)" v-t="'save'" type="submit")
    q-btn(v-t="'reset'" type="reset")
    q-btn(v-if="true" v-t="'cancel'" :to="previous")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component, Watch } from 'vue-property-decorator'
import { ElementLoaderMixin } from 'src/boot/hasura'
import Text from './fields/edit/Text.vue'
import BooleanField from './fields/edit/Boolean.vue'
import ArrayField from './fields/edit/Array.vue'
import ObjectField from './fields/edit/Object.vue'
import { Route } from 'vue-router'
import { ObjectMap } from 'src/types/common'
import {
  RelationshipProperty,
  BaseProperty
} from 'src/boot/hasura/schema/properties'
import { permittedFieldsOf } from '@casl/ability/extra'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

@Component({
  components: {
    'h-edit-field-text': Text,
    'h-edit-field-array': ArrayField,
    'h-edit-field-object': ObjectField,
    'h-edit-field-bool': BooleanField
  }
})
export default class EditElementDispatcher extends Mixins(ElementLoaderMixin) {
  form: ObjectMap = {}

  /**
   * * Returns the property name the form needs to use:
   * - the property name in case of a 'column' property
   * - the name of the foreign key column in case of an 'object' relationship property
   * TODO - Arrays
   * ! The current system does not take into account relationships with multiple column keys!
   *  */

  propertyFieldName(property: BaseProperty) {
    // <=> test: if property is a RelationshipProperty
    if ('mapping' in property) {
      let keyColumns = (property as RelationshipProperty).keyColumns
      return keyColumns && keyColumns[0].name
    }
    return property.name
  }

  get action() {
    return Object.keys(this.element).length > 0 ? 'update' : 'insert'
  }

  // TODO
  submit() {
    console.log('todo save')
  }

  // TODO
  reset() {
    console.log('init form')
    // Keeps only allowed fields
    const permittedColumns = permittedFieldsOf(
      this.$ability,
      this.action,
      this.tableClass && this.tableClass.name
    )
    // TODO set default values from the initial element
    // TODO set default values from the hasura permissions and from the backend schema
    // TODO set the possible 'object' or 'array' property values?
    this.form = permittedColumns.reduce<ObjectMap>((aggr, fieldName) => {
      aggr[fieldName] = this.element[fieldName]
      return aggr
    }, {})
  }

  get previous() {
    if (this.$from) {
      return this.$from.path
    } else
      return this.$route.path.substring(
        0,
        this.$route.path.lastIndexOf('/edit')
      )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeRouteEnter(to: Route, from: Route, next: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next((vm: any) => {
      if (!vm.$can('update', vm.element)) {
        console.log('cannot update') // TODO navigation guard
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeRouteLeave(to: Route, from: Route, next: any) {
    console.log('Confirm leaving the page if modifications done') // TODO
    //* See https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    next()
  }

  /**
   * Watches if the element has been loaded, so it can set the initial form.
   */
  @Watch('element')
  onElementChanged() {
    this.reset()
  }
}
</script>
