<template lang="pug">
div
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-field(:label="$t(tableName +'.labels.'+name)" :key="name" :name="name" stack-label)
      template(v-slot:control)
        h-chip(v-if="element[property.name]" :tableClass="property.reference" :element="element[property.name]")
  slot(name="after-field" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldMixin } from 'src/boot/hasura'
import Chip from 'src/components/hasura-table/Chip.vue'

@Component({
  components: {
    'h-chip': Chip
  }
})
export default class ReadManyToOneField extends Mixins(FieldMixin) {}
</script>
