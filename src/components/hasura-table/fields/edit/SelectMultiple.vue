<template lang="pug">
div(v-if="element")
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-select(:label="$t(tableName +'.labels.'+name)"
      filled
      multiple
      use-chips
      :hint="$t(tableName +'.helpers.'+name)"
      hide-hint
      :error-label="$t(tableName +'.errors.'+name)"
      v-model="formValue"
      :options="options"
      option-value="_id"
      option-label="_label"
      :clearable="!property.required"
      use-input
      input-debounce="0"
      @filter="filterOptions"
      :key="name"
      :name="name"
      stack-label)
  slot(name="after-field" :property="property" :element="element")
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin, FieldOptionsMixin } from 'src/boot/hasura'

@Component
export default class SelectMultiple extends Mixins(
  FieldEditMixin,
  FieldOptionsMixin
) {}
</script>
