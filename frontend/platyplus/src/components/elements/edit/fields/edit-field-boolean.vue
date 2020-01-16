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
import { createComponent } from '@vue/composition-api'

import { useTranslator } from '../../../../composables/i18n'
import {
  useMetadata,
  useComponentName,
  useFormFieldValue,
  fieldEditProps
} from '../../../../composables/metadata'

export default createComponent({
  props: fieldEditProps(Boolean, false),
  setup(props, context) {
    const metadata = useMetadata(props)
    const componentName = useComponentName('edit')
    const translate = useTranslator()
    const formValue = useFormFieldValue<boolean>(props, context)
    return {
      metadata,
      componentName,
      translate,
      formValue
    }
  }
})
// import { Component, Mixins } from 'vue-property-decorator'
// import { FieldEditMixin } from '../../../../mixins'

// @Component
// export default class EditBooleanField extends Mixins(FieldEditMixin) {}
</script>
