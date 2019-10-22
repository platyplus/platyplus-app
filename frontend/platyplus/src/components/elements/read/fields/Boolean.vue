<template lang="pug">
div
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-field(:label="$t(tableName +'.labels.'+name)" :key="name" :name="name" stack-label)
      template(v-slot:control)
        q-toggle(v-model="elementValue" disable)
  slot(name="after-field" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldMixin } from '../../../../mixins'

@Component
export default class ReadBooleanField extends Mixins(FieldMixin) {}
</script>
