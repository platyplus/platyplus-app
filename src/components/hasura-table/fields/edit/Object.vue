<template lang="pug">
div(v-if="element")
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-select(:label="$t(tableName +'.labels.'+name)"
      :hint="$t(tableName +'.helpers.'+name)"
      hide-hint
      :error-label="$t(tableName +'.errors.'+name)"
      v-model="formValue"
      :options="options"
      :option-value="optionValue"
      option-label="_label"
      emit-value
      map-options
      :clearable="true"
      filter
      :key="name"
      :name="name"
      stack-label)
  slot(name="after-field" :property="property" :element="element")
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin, optionsQuery } from 'src/boot/hasura'
import { ObjectMap } from '../../../../types/common'
import { ability } from 'src/boot/user/store'
import { get } from 'object-path'

@Component({
  apollo: {
    options: {
      query() {
        return optionsQuery(this.property, ability)
      },
      update(data: Record<string, ObjectMap[]>) {
        return data[Object.keys(data)[0]].map(item => ({
          ...item,
          _label: this.property.tableClass.label(item)
        }))
      }
    }
  }
})
export default class EditObjectField extends Mixins(FieldEditMixin) {
  options = []

  // ! The options system will only work for elements with single column primary keys
  get optionValue() {
    return (
      (this.property && get(this.property, 'tableClass.idColumnNames.0')) ||
      'id'
    )
  }
  // TODO clearable field if not required
}
</script>
