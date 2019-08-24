<template lang="pug">
div(v-if="element")
  slot(name="before-field" :property="property" :element="element")
  slot(name="field" :property="property"  :element="element")
    q-field(:label="$t(tableName +'.labels.'+name)" :key="name" :name="name" stack-label)
      template(v-slot:control)
        h-list(type="chips" :tableClass="property.reference" :list="elementValue")
  slot(name="after-field" :property="property" :element="element")
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FieldEditMixin } from 'src/boot/hasura'
import List from 'src/components/hasura-table/ListDispatcher.vue'

@Component({
  components: {
    'h-list': List
  }
})
export default class EditArrayField extends Mixins(FieldEditMixin) {}
</script>
