<template lang="pug">
div
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-field(:label="$t(tableName +'.labels.'+name)" :key="name" :name="name" stack-label)
      template(v-slot:control)
        h-collection(type="chips" :tableClass="property.reference" :list="elementValue")
  slot(name="after-field" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldMixin } from 'src/mixins'
import Collection from '../../../collections/Dispatcher.vue'

@Component({
  components: {
    'h-collection': Collection
  }
})
export default class ReadArrayField extends Mixins(FieldMixin) {}
</script>
