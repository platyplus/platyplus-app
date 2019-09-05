<template lang="pug">
div(v-if="element")
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-field(:label="$t(tableName +'.labels.'+name)" :key="name" :name="name" stack-label filled)
      template(v-slot:control)
        q-toggle(v-model="formValue")
  slot(name="after-field" :property="property" :element="element")
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin } from 'src/boot/hasura'

@Component
export default class EditBooleanField extends Mixins(FieldEditMixin) {}
</script>
