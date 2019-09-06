<template lang="pug">
div
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-field(:label="$t(tableName +'.labels.'+name)" :key="name" :name="name" stack-label)
      template(v-slot:control)
        h-collection(:tableClass="property.reference" :list="elementValue")
  slot(name="after-field" :property="property" :element="element")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldMixin } from 'src/boot/hasura'
import Collection from 'src/components/hasura-table/CollectionDispatcher.vue'

@Component({
  components: {
    'h-collection': Collection
  }
})
export default class ReadOneToManyField extends Mixins(FieldMixin) {}
</script>
