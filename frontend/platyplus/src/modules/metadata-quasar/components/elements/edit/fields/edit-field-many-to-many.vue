<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-select(
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
      input-debounce="0"
      multiple
      option-value="_id"
      option-label="_label"
      use-chips
      use-input
      stack-label)
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// :clearable="!propertyMetadata.required"
import { createComponent, computed, Ref } from '@vue/composition-api'

import { useTranslator } from '../../../../../i18n'
import {
  useMetadata,
  fieldEditProps,
  useFieldMetadata,
  useOptionsLoader,
  ManyToManyRelationship,
  optionToElement,
  elementToOption,
  OptionObject,
  DataObject
} from '../../../../../metadata'

export default createComponent({
  props: fieldEditProps(Array, () => []),
  setup(props, { emit }) {
    const metadata = useMetadata(props)
    const translate = useTranslator()
    const relationship = useFieldMetadata(props) as Ref<ManyToManyRelationship>

    const formValue = computed({
      get: () => {
        const target = relationship.value?.targetPropertyName
        return props.value?.map((item: DataObject) =>
          elementToOption(item[target])
        )
      },
      set: value => {
        const target = relationship.value?.targetPropertyName
        emit(
          'input',
          value?.map((item: OptionObject) => ({
            [target]: optionToElement(item)
          }))
        )
      }
    })
    const { options, filter } = useOptionsLoader(relationship)
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
