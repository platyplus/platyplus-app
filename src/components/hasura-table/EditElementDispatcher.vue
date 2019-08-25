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
    q-btn(v-if="true" v-t="'cancel'" @click="read()")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { FormManagerMixin, BaseProperty } from 'src/boot/hasura'
import Text from './fields/edit/Text.vue'
import BooleanField from './fields/edit/Boolean.vue'
import ArrayField from './fields/edit/Array.vue'
import ObjectField from './fields/edit/Object.vue'
import { RelationshipProperty } from 'src/boot/hasura/schema/properties'

@Component({
  components: {
    'h-edit-field-text': Text,
    'h-edit-field-array': ArrayField,
    'h-edit-field-object': ObjectField,
    'h-edit-field-bool': BooleanField
  }
})
export default class EditElementDispatcher extends Mixins(FormManagerMixin) {
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
}
</script>
