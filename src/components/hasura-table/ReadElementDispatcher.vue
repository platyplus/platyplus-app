<template lang="pug">
div
  slot(name="before-fields" :element="element")
  slot(name="fields" :element="element")
    component(v-for="property, key in fields" :key="'field-'+key" :is="componentName(property)" :property="property" :element="element" :tableClass="property.class")
  slot(name="after-fields" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { permittedFieldsOf } from '@casl/ability/extra'
import { ElementLoaderMixin, BaseProperty } from 'src/boot/hasura'
import Text from './fields/read/Text.vue'
import BooleanField from './fields/read/Boolean.vue'
import ArrayField from './fields/read/Array.vue'
import ObjectField from './fields/read/Object.vue'

@Component({
  components: {
    'h-read-field-text': Text,
    'h-read-field-array': ArrayField,
    'h-read-field-object': ObjectField,
    'h-read-field-bool': BooleanField
  }
})
export default class ReadElementDispatcher extends Mixins(ElementLoaderMixin) {
  /**
   * Shows only the column fields that are not keys (primary or foreign),
   * and the relationships related to the permitted foreign keys
   * TODO 'multiple' relationship fields
   */
  get fields() {
    const result = []
    if (this.tableClass) {
      const permittedColumns = permittedFieldsOf(
        this.$ability,
        'select',
        this.tableClass.name
      )
      for (const columnName of permittedColumns) {
        const property = this.tableClass.getColumnProperty(columnName)
        if (property) {
          if (property.isReference) {
            result.push(...property.references)
          } else if (!property.isId) {
            result.push(property)
          }
        }
      }
    }
    return result
  }

  componentName(property: BaseProperty) {
    const propertyType = property ? property.type : 'text'
    const possibleComponentName = `h-read-field-${propertyType}`
    if (this.$options.components) {
      const components = Object.keys(this.$options.components)
      if (components.includes(possibleComponentName))
        return possibleComponentName
    }
    console.log(`No component for the '${propertyType}' property type.`)
    return 'h-read-field-text'
  }
}
</script>
