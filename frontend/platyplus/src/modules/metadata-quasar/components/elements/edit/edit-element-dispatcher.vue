<template lang="pug">
q-form(autofocus @reset="reset.action()" @submit="save.action()")
  validation-observer(ref="validator")
    slot(name="before-fields" :element="element")
    slot(name="fields" :element="element")
      component(v-for="property, key in fields"
        :key="'field-'+key"
        :is="componentName(property, 'h-edit-field')"
        :property="property.name"
        :element="element"
        :table="table"
        v-model="form[property.name]")
    slot(name="after-fields" :element="element")
    slot(name="before-actions" :element="element")
    slot(name="actions" :element="element")
      q-btn(v-if="save.permission" :label="save.label.value" type="submit")
      q-btn(:label="reset.label.value" type="reset")
      q-btn(:label="cancel.label.value" @click="cancel.action()")
    slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { useTranslator } from '../../../../i18n'
import {
  useMetadata,
  tableProps,
  useComponentName,
  useElementId,
  useElementLoader,
  useCancelEditElement,
  useSaveElement,
  useResetForm,
  useForm,
  useIsNew
} from '../../../../metadata'
import { useRouteQuery, useRouter } from '../../../../common'

export default createComponent({
  props: { ...tableProps },
  setup(props) {
    const metadata = useMetadata(props)
    const router = useRouter()
    const routeQuery = useRouteQuery(router)
    const element = useElementLoader(
      useElementId(metadata, routeQuery),
      metadata
    )
    const form = useForm(metadata, element)
    const componentName = useComponentName('edit')
    const translate = useTranslator()
    const save = useSaveElement(metadata, element, form)
    const reset = useResetForm(metadata, element, form)
    const cancel = useCancelEditElement(metadata, element, form)
    const isNew = useIsNew(element)
    const fields = computed(() =>
      metadata.value.fields.filter(
        property => (isNew.value ? property.canInsert : property.canUpdate) // TODO only works with columns
      )
    )
    return {
      metadata,
      element,
      componentName,
      translate,
      save,
      reset,
      cancel,
      form,
      fields
    }
  }
})
</script>
