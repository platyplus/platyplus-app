<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-field(:label="$t(table +'.labels.'+property)" :key="property" :name="property" stack-label)
      template(v-slot:control)
        q-toggle(v-model="value" disable)
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { fieldComponent } from '../../../../composables/metadata'
export default fieldComponent()
</script>
