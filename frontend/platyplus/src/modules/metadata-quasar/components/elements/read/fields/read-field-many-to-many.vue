<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-field(:label="translate(table +'.labels.'+property)" :key="property" :name="property" stack-label)
      template(v-slot:control)
        h-collection-dispatcher(type="chips" :table="table" :list="value")
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// TODO :table="property.through.reference"
import { fieldComponent } from '../../../../../metadata'
export default fieldComponent()
</script>
