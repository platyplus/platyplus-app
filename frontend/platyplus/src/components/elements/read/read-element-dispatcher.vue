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
    q-btn(v-if="$can('update', element)" :label="translate('edit')" @click="edit()")
    q-btn(v-if="canDelete" :label="translate('remove')" @click="remove()")
  slot(name="after-actions" :element="element")
</template>

<script lang="ts">
/** // TODO
 * - element composable: navigate to read, edit etc.
 * - mutations composable: useDelete
 */

import { createComponent, watch } from '@vue/composition-api'

import { useTranslator } from '../../../composables/i18n'
import {
  useMetadata,
  tableProps,
  useComponentName,
  useElementId,
  useElementLoader,
  useCanDelete,
  useDeleteElement
} from '../../../composables/metadata'
import { useStore } from '../../../store'
import { label } from '../../../modules/metadata'

export default createComponent({
  props: {
    ...tableProps
  },
  setup(props) {
    const metadata = useMetadata(props)
    const element = useElementLoader(props, useElementId(props))
    const componentName = useComponentName('read')
    const translate = useTranslator()
    const canDelete = useCanDelete(element)
    const remove = useDeleteElement(props, element)
    const store = useStore()
    watch(() => {
      store.commit('navigation/setTitle', {
        label: label(metadata.value, element.value),
        translate: false
      })
    })
    return { metadata, element, componentName, translate, remove, canDelete }
  }
})
</script>
