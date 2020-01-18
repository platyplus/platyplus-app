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
import { createComponent } from '@vue/composition-api'
import { useTranslator } from '../../../../../i18n'
import {
  useMetadata,
  fieldEditProps,
  useComponentName,
  useFormFieldValue
} from '../../../../../metadata'

export default createComponent({
  props: fieldEditProps(String, ''),
  setup(props, context) {
    const metadata = useMetadata(props)
    const componentName = useComponentName('edit')
    const translate = useTranslator()
    const formValue = useFormFieldValue<string>(props, context)
    return {
      metadata,
      componentName,
      translate,
      formValue
    }
  }
})
</script>
