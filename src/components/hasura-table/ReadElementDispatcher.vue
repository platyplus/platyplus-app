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
    q-btn(v-if="$can('update', element)" v-t="'edit'" @click="edit()")
    q-btn(v-if="$can('delete', element)" v-t="'remove'" @click="remove()")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ElementLoaderMixin } from 'src/boot/hasura'
import Text from './fields/read/Text.vue'
import BooleanField from './fields/read/Boolean.vue'
import ArrayField from './fields/read/Array.vue'
import ManyToManyField from './fields/read/ManyToMany.vue'
import OneToManyField from './fields/read/OneToMany.vue'
import ManyToOneField from './fields/read/ManyToOne.vue'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

@Component({
  components: {
    'h-read-field-text': Text,
    'h-read-field-many-to-many': ManyToManyField,
    'h-read-field-nested-many-to-many': ArrayField, // TODO
    'h-read-field-complete-many-to-many': ArrayField, // TODO
    'h-read-field-one-to-many': OneToManyField,
    'h-read-field-nested-one-to-many': ArrayField, // TODO
    'h-read-field-complete-one-to-many': ArrayField, // TODO
    'h-read-field-many-to-one': ManyToOneField,
    'h-read-field-nested-many-to-one': ManyToOneField, // TODO
    'h-read-field-complete-many-to-one': ManyToOneField, // TODO
    'h-read-field-bool': BooleanField
  }
})
export default class ReadElementDispatcher extends Mixins(ElementLoaderMixin) {}
</script>
