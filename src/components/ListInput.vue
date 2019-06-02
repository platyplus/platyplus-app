<template lang="pug">
  div TODO:
    q-list
      q-item(v-for="(v, k) in value" :key="'list-input-item-'+k") {{label(k)}}
    q-input(
          :readonly="readonly"
          v-model="newItem")
</template>

<script>
export default {
  name: 'ListInput',
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => []
    },
    optionKey: {
      type: String,
      default: 'id'
    },
    optionLabel: {
      type: String,
      default: 'value'
    },
    types: {
      type: [Array, String, Boolean],
      default: true
    }
  },
  data () {
    return {
      newItem: '',
      newType: Array.isArray(this.types) ? this.types[0] : this.types
    }
  },
  methods: {
    label (key) {
      return this.options.find(x => x[this.optionKey] === key)[this.optionLabel]
    }
  }
}
</script>
