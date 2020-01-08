<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    validation-provider(:name="table+'.labels.'+property" v-slot="{ errors, invalid, touched, validated }" :rules="rules" slim)
      q-input(:label="$t(table+'.labels.'+property)"
        filled
        :key="property"
        :name="property"
        v-model="formValue"
        :error-message="errors[0]"
        :error="(touched || validated) && invalid")
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin } from '../../../../mixins'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationProvider
  }
})
export default class EditTextField extends Mixins(FieldEditMixin) {}
</script>
