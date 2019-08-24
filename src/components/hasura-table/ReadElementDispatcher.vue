<template lang="pug">
div
  slot(name="before-fields" :element="element")
  slot(name="fields" :element="element")
    component(v-for="property, key in fields('select')"
      :key="'field-'+key"
      :is="componentName(property, 'h-read-field')"
      :property="property"
      :element="element"
      :tableClass="property.class")
  slot(name="after-fields" :element="element")
  slot(name="before-actions" :element="element")
  slot(name="actions" :element="element")
    q-btn(v-if="$can('update', element)" v-t="'edit'" :to="id+'/edit'")
    q-btn(v-if="$can('delete', element)" v-t="'remove'" @click="")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ElementLoaderMixin } from 'src/boot/hasura'
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
export default class ReadElementDispatcher extends Mixins(ElementLoaderMixin) {}
</script>
