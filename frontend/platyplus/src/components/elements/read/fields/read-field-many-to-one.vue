<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-field(:label="translate(table +'.labels.'+property)" :key="property" :name="property" stack-label)
      template(v-slot:control)
        h-chip(v-if="value" :table="table" :element="value")
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// TODO :table="property.reference"
import { fieldComponent } from '../../../../modules/metadata'
export default fieldComponent()
</script>
