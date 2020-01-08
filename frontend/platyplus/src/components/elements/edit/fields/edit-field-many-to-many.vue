<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-select(:label="$t(table +'.labels.'+property)"
      filled
      multiple
      use-chips
      :hint="$t(table +'.helpers.'+property)"
      hide-hint
      :error-label="$t(table +'.errors.'+property)"
      v-model="formValue"
      :options="options"
      option-value="_id"
      option-label="_label"
      :clearable="!propertyMetadata.required"
      use-input
      input-debounce="0"
      @filter="filterOptions"
      :key="property"
      :name="property"
      stack-label)
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldManyToManyMixin, FieldOptionsMixin } from '../../../../mixins'

@Component
export default class EditManyToManyField extends Mixins(
  FieldOptionsMixin,
  FieldManyToManyMixin
) {}
</script>
