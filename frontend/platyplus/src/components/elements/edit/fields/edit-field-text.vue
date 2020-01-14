<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    validation-provider(:name="table+'.labels.'+property" v-slot="{ errors, invalid, touched, validated }" :rules="''" slim)
      q-input(:label="translate(table+'.labels.'+property)"
        filled
        :key="property"
        :name="property"
        v-model="formValue"
        :error-message="errors[0]"
        :error="(touched || validated) && invalid")
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'

import { useTranslator } from '../../../../composables/i18n'
import {
  useMetadata,
  fieldProps,
  useComponentName
} from '../../../../composables/metadata'

export default createComponent({
  props: {
    ...fieldProps,
    value: { type: String, required: true, default: '' }
  },
  setup(props, { emit }) {
    const metadata = useMetadata(props)
    const componentName = useComponentName('edit')
    const translate = useTranslator()
    const formValue = computed({
      get: () => props.value,
      set: value => emit('input', value)
    })
    return {
      metadata,
      componentName,
      translate,
      formValue
    }
  }
})
</script>
