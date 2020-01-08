<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-field(:label="$t(table +'.labels.'+property)" :key="property" :name="property" stack-label filled)
      template(v-slot:control)
        q-toggle(v-model="formValue")
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin } from '../../../../mixins'

@Component
export default class EditBooleanField extends Mixins(FieldEditMixin) {}
</script>
