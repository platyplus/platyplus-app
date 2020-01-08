<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-select(:label="$t(table +'.labels.'+property)"
      filled
      multiple
      use-chips
      :hint="$t(table +'.helpers.'+property)"
      hide-hint
      :error-label="$t(table +'.errors.'+property)"
      v-model="formValue"
      :options="options"
      option-value="_id"
      option-label="_label"
      :clearable="!propertyMetadata.required"
      use-input
      input-debounce="0"
      @filter="filterOptions"
      :key="property"
      :name="property"
      stack-label)
      template(v-slot:selected-item="{opt, removeAtIndex, tabindex, index}")
        q-chip(dense
          :removable="canRemove(opt)" 
          @remove="removeAtIndex(index)"
          tabindex="tabindex") {{opt._label}}
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin, FieldOptionsMixin } from '../../../../mixins'
import { ObjectMap } from '../../../../types/common'
// import { optionAsElement } from '../../../../modules/metadata'

@Component
export default class SelectMultiple extends Mixins(
  FieldEditMixin,
  FieldOptionsMixin
) {
  canRemove(option: ObjectMap) {
    // TODO: on peut supprimer un org_unit.child quand parent_id est modifiable et nullable
    // TODO: bloquer l'icône 'x' dans le chip ne suffit pas: il faut aussi désactiver la déselection dans le dropdown
    // TODO recode
    // return this.$can('update', optionAsElement(option), 'parent_id')
    console.log(option)
    return true
  }
}
</script>
