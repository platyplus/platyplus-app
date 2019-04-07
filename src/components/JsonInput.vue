<template lang="pug">
  codemirror(:options="options" ref="codemirror" :value="stringifiedValue" @input="onCmCodeChange")
</template>

<script>
import VueCodemirror from 'vue-codemirror'
export default {
  extends: VueCodemirror,
  name: 'JsonInput',
  props: ['readonly', 'value'],
  data: function () {
    return { initialValue: this.value }
  },
  methods: {
    onCmCodeChange (val) {
      this.$emit('input', JSON.parse(val))
    }
  },
  computed: {
    options () {
      if (this.readonly) {
        return {
          readOnly: 'nocursor',
          styleActiveLine: false
        }
      } else {
        return {
          readOnly: false,
          styleActiveLine: true
        }
      }
    },
    stringifiedValue () {
      return JSON.stringify(this.value, null, 2)
    }
  }
}
</script>
