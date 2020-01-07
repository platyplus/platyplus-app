<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-field(:label="$t(table +'.labels.'+property)" :key="property" :name="property" stack-label)
      template(v-slot:control)
        h-collection(type="chips" :table="table" :list="value")
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { fieldComponent } from '../../../../composables/metadata'
import Collection from '../../../collections/Dispatcher.vue'

// TODO :tableClass="property.reference"
export default createComponent({
  ...fieldComponent,
  name: 'ReadOneToManyField',
  components: {
    'h-collection': Collection
  }
})
</script>
