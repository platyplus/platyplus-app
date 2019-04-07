<template lang="pug">
  codemirror(:options="options" ref="codemirror" :value="stringifiedValue" @input="onCmCodeChange")
</template>

<script>
/**
 * Input component to edit JSON with codemirror.
 * v-model send the last valid JSON value entered by the user, or the initial one
 * TODO: make if work as a form input i.e. implement validations
 */
import VueCodemirror from 'vue-codemirror'
export default {
  extends: VueCodemirror,
  name: 'JsonInput',
  props: ['readonly', 'value'],
  data: function () {
    return { lastValue: this.value }
  },
  methods: {
    onCmCodeChange (val) {
      try {
        const jsonVal = JSON.parse(val)
        this.$emit('input', jsonVal)
        this.lastValue = jsonVal
      } catch (e) {
        this.$emit('input', this.lastValue)
      }
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
