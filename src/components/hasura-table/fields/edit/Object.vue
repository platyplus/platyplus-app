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
      option-value="_id"
      option-label="_label"
      :clearable="!property.required"
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
import { elementAsOption } from 'src/boot/hasura/graphql/common'

@Component({
  apollo: {
    options: {
      query() {
        return optionsQuery(this.property, ability)
      },
      update(data: Record<string, ObjectMap[]>) {
        return data[Object.keys(data)[0]].map(item =>
          elementAsOption(item, this.property)
        )
      }
    }
  }
})
export default class EditObjectField extends Mixins(FieldEditMixin) {
  options = []
}
</script>
