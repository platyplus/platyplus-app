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
      input-debounce="0"
      multiple
      option-value="_id"
      option-label="_label"
      use-chips
      use-input
      stack-label)
      template(#no-option)
        q-item
          q-item-section(class="text-grey") No results
      template(#selected-item="{opt, removeAtIndex, tabindex, index}")
        q-chip(dense
          :removable="canRemove(opt)" 
          @remove="removeAtIndex(index)"
          tabindex="tabindex") {{opt._label}}
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// :clearable="!propertyMetadata.required"
import { createComponent, computed } from '@vue/composition-api'
import { useTranslator } from '../../../../../i18n'
import {
  useMetadata,
  fieldEditProps,
  useFieldMetadata,
  useOptionsLoader,
  elementToOption,
  optionToElement,
  OptionObject,
  DataObject
} from '../../../../../metadata'

export default createComponent({
  props: fieldEditProps(Array, () => []),
  setup(props, { emit }) {
    const metadata = useMetadata(props)
    const translate = useTranslator()
    const formValue = computed({
      get: () =>
        props.value?.map((item: DataObject) => elementToOption(item)) || [],
      set: value =>
        emit(
          'input',
          value?.map((item: OptionObject) => optionToElement(item))
        )
    })
    const relationship = useFieldMetadata(props)
    const { options, filter, canRemove } = useOptionsLoader(
      computed(() => props.element),
      relationship
    )
    return {
      metadata,
      translate,
      formValue,
      options,
      filter,
      canRemove
    }
  }
})
// canRemove(option: ObjectMap) {
//   // TODO: on peut supprimer un org_unit.child quand parent_id est modifiable et nullable
//   // TODO: bloquer l'icône 'x' dans le chip ne suffit pas: il faut aussi désactiver la déselection dans le dropdown
//   // TODO recode
//   // return this.$can('update', optionAsElement(option), 'parent_id')
//   return true
// }
</script>
