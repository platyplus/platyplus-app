<template lang="pug">
div
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-select(:label="$t(tableName +'.labels.'+name)"
      filled
      multiple
      use-chips
      :hint="$t(tableName +'.helpers.'+name)"
      hide-hint
      :error-label="$t(tableName +'.errors.'+name)"
      v-model="formValue"
      :options="options"
      option-value="_id"
      option-label="_label"
      :clearable="!property.required"
      use-input
      input-debounce="0"
      @filter="filterOptions"
      :key="name"
      :name="name"
      stack-label)
      template(v-slot:selected-item="{opt, removeAtIndex, tabindex, index}")
        q-chip(dense
          :removable="canRemove(opt)" 
          @remove="removeAtIndex(index)"
          tabindex="tabindex") {{opt._label}}
  slot(name="after-field" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin, FieldOptionsMixin } from 'src/mixins'
import { ObjectMap } from 'src/types/common'
import { optionAsElement } from 'src/hasura/graphql/common'

@Component
export default class SelectMultiple extends Mixins(
  FieldEditMixin,
  FieldOptionsMixin
) {
  canRemove(option: ObjectMap) {
    // TODO: on peut supprimer un org_unit.child quand parent_id est modifiable et nullable
    // TODO: bloquer l'icône 'x' dans le chip ne suffit pas: il faut aussi désactiver la déselection dans le dropdown
    return this.$can('update', optionAsElement(option), 'parent_id')
  }
}
</script>
