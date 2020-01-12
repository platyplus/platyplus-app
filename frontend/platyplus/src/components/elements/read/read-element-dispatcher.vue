<template lang="pug">
div
  slot(name="before-fields" :element="element")
  slot(name="fields" :element="element")
    component(v-for="property in metadata.fields"
      :key="'field-'+property.name"
      :is="componentName(property)"
      :property="property.name"
      :element="element"
      :table="table")
  slot(name="after-fields" :element="element")
  slot(name="before-actions" :element="element")
  slot(name="actions" :element="element")
    q-btn(v-if="edit.permission" :label="edit.label.value" @click="edit.action()")
    q-btn(v-if="remove.permission" :label="remove.label.value" @click="remove.action()")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { useTranslator } from '../../../composables/i18n'
import {
  useMetadata,
  tableProps,
  useComponentName,
  useElementId,
  useElementLoader,
  useDeleteElement,
  useEditElement
} from '../../../composables/metadata'

export default createComponent({
  props: {
    ...tableProps
  },
  setup(props) {
    const metadata = useMetadata(props)
    const element = useElementLoader(props, useElementId(props))
    const componentName = useComponentName('read')
    const translate = useTranslator()
    const edit = useEditElement(element)
    const remove = useDeleteElement(element)
    return { metadata, element, componentName, translate, edit, remove }
  }
})
</script>
