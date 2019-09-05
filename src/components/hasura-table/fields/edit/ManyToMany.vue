<template lang="pug">
Select(v-if="element" :multiple="true"
  :property="property"
  :element="element"
  :tableClass="property.class"
  v-model="formValue")
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldManyToManyMixin, FieldOptionsMixin } from 'src/boot/hasura'
import Select from './Select.vue'

@Component({
  components: {
    Select
  }
})
export default class EditManyToManyField extends Mixins(
  FieldOptionsMixin,
  FieldManyToManyMixin
) {}
</script>
