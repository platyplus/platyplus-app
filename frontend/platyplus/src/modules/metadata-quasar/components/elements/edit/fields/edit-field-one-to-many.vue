<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-select(:label="translate(table +'.labels.'+property)"
      filled
      multiple
      use-chips
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
      //- template(v-slot:selected-item="{opt, removeAtIndex, tabindex, index}")
        q-chip(dense
          :removable="canRemove(opt)" 
          @remove="removeAtIndex(index)"
          tabindex="tabindex") {{opt._label}}
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// @filter="filterOptions"
// :clearable="!propertyMetadata.required"
import { createComponent, computed } from '@vue/composition-api'
import { useTranslator } from '../../../../../i18n'
import {
  useMetadata,
  fieldEditProps,
  useComponentName,
  useFieldMetadata,
  useOptionsLoader,
  elementToOption
} from '../../../../../metadata'

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
// canRemove(option: ObjectMap) {
//   // TODO: on peut supprimer un org_unit.child quand parent_id est modifiable et nullable
//   // TODO: bloquer l'icône 'x' dans le chip ne suffit pas: il faut aussi désactiver la déselection dans le dropdown
//   // TODO recode
//   // return this.$can('update', optionAsElement(option), 'parent_id')
//   return true
// }
</script>
