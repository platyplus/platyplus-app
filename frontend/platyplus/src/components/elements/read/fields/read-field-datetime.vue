<template lang="pug">
div
  slot(name="before-field" :table="table" :property="property" :element="element")
  slot(name="field" :table="table" :property="property" :element="element")
    q-field(:label="$t(table +'.labels.'+property)" :key="property" :name="property" stack-label)
      template(v-slot:control)
        div {{value}}
  slot(name="after-field" :table="table" :property="property" :element="element")
</template>

<script lang="ts">
// TODO present datetime in a user friendly way
import { createComponent, computed } from '@vue/composition-api'
import { fieldProps } from '../../../../composables/metadata'
import { date } from 'quasar'

export default createComponent({
  props: { ...fieldProps },
  setup(props) {
    const value = computed(() =>
      date.formatDate(props.element[props.property], 'DD/MM/YYYY HH:mm:ss')
    )
    return { value }
  }
})
</script>
