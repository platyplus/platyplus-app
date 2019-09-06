<template lang="pug">
div
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    validation-provider(v-slot="{ errors, invalid }" :rules="rules" slim)
      q-input(:label="$t(tableName +'.labels.'+name)"
        filled
        :key="name"
        :name="name"
        v-model="formValue"
        :error-message="errors[0]"
        :error="invalid")
  slot(name="after-field" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin } from 'src/boot/hasura'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationProvider
  }
})
export default class EditTextField extends Mixins(FieldEditMixin) {}
</script>
