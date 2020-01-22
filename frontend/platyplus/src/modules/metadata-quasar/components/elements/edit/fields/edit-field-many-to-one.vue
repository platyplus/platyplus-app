<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-select(
      :clearable="true"
      :error-label="translate(table +'.errors.'+property)"
      :hint="translate(table +'.helpers.'+property)"
      :key="property"
      :label="translate(table +'.labels.'+property)"
      :name="property"
      :options="options"
      v-model="formValue"
      @filter="filter"
      filled
      fill-input
      hide-hint
      hide-selected
      input-debounce="0"
      option-value="_id"
      option-label="_label"
      use-input
      stack-label)
      template(#no-option)
        q-item
          q-item-section(class="text-grey") No results
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// TODO     :clearable="!relationship.required"

import { createComponent, computed } from '@vue/composition-api'

import { useTranslator } from '../../../../../i18n'
import {
  useMetadata,
  fieldEditProps,
  useFieldMetadata,
  useOptionsLoader,
  elementToOption,
  optionToElement
} from '../../../../../metadata'

export default createComponent({
  props: fieldEditProps(Object, () => ({})),
  setup(props, { emit }) {
    const metadata = useMetadata(props)
    const translate = useTranslator()
    const formValue = computed({
      get: () => elementToOption(props.value),
      set: value => emit('input', optionToElement(value))
    })
    const relationship = useFieldMetadata(props)
    const { options, filter } = useOptionsLoader(
      computed(() => props.element),
      relationship
    )
    return {
      metadata,
      translate,
      formValue,
      options,
      filter
    }
  }
})
</script>
