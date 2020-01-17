<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-select(:label="translate(table +'.labels.'+property)"
      filled
      :hint="translate(table +'.helpers.'+property)"
      hide-hint
      :error-label="translate(table +'.errors.'+property)"
      v-model="formValue"
      :options="options"
      option-value="_id"
      option-label="_label"
      use-input
      input-debounce="0"
      :key="property"
      :name="property"
      stack-label)
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
//       @filter="filterOptions"
//       :clearable="!relationship.required"

import { createComponent, computed } from '@vue/composition-api'

import { useTranslator } from '../../../../modules/i18n'
import {
  useMetadata,
  fieldEditProps,
  useComponentName,
  useFieldMetadata,
  useOptionsLoader,
  elementToOption
} from '../../../../modules/metadata'

export default createComponent({
  props: fieldEditProps(Object, () => ({})),
  setup(props, { emit }) {
    const metadata = useMetadata(props)
    const componentName = useComponentName('edit')
    const translate = useTranslator()
    const formValue = computed({
      get: () => elementToOption(props.value),
      set: value => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, _label, ...result } = value
        emit('input', result)
      }
    })
    const relationship = useFieldMetadata(props)
    const options = useOptionsLoader(relationship)
    return {
      metadata,
      componentName,
      translate,
      formValue,
      options
    }
  }
})
</script>
