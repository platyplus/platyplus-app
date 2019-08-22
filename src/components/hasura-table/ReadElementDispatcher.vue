<template lang="pug">
div
  slot(name="before-fields" :element="element")
  slot(name="fields" :element="element")
    component(v-for="property, key in fields" :key="'field-'+key" :is="componentName(property)" :property="property" :element="element" :tableClass="property.class")
  slot(name="after-fields" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
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
  get fields() {
    return (this.tableClass && this.tableClass.selectProperties) || []
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
