<template lang="pug">
div
  slot(name="before-fields" :element="element")
  slot(name="fields" :element="element")
    component(v-for="property in metadata.fields"
      :key="'field-'+property.name"
      :is="componentName(property, 'h-read-field')"
      :property="property.name"
      :element="element"
      :table="table")
  slot(name="after-fields" :element="element")
  slot(name="before-actions" :element="element")
  slot(name="actions" :element="element")
    q-btn(v-if="$can('update', element)" :label="$t('edit')" @click="edit()")
    q-btn(v-if="$can('delete', element)" :label="$t('remove')" @click="remove()")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ElementLoaderMixin } from '../../../mixins'

// Component.registerHooks([
//   'beforeRouteEnter',
//   'beforeRouteLeave',
//   'beforeRouteUpdate'
// ])

@Component
export default class ReadElementDispatcher extends Mixins(ElementLoaderMixin) {}
</script>
