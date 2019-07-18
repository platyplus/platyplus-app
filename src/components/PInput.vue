<template lang="pug">
  q-input(
    ref="input"
    :type="inputType"
    :label="$t(form +'.labels.'+name)"
    :hint="$t(form +'.helpers.'+name)"
    :error-label="$t(form +'.errors.'+name)"
    :value="value"
    :readonly="readonly"
    :mask="mask"
    @input="handleChange"
    @keyup.enter="enter"
    hide-hint)
    template(v-if="icon" v-slot:prepend)
      q-icon(:name="'fas fa-'+icon")
</template>
<script>
import { QInput } from 'quasar'
import { icon, types } from './config'
export default {
  extends: QInput,
  components: {
    QInput
  },
  props: ['enter', 'form', 'name'],
  methods: {
    handleChange (newVal) {
      this.$emit('input', newVal)
    },
    focus () {
      this.$refs.input.focus()
    }
  },
  computed: {
    icon () {
      return icon(this.form, this.name)
    },
    inputType () {
      return types[this.name] || 'text'
    }
  }
}
</script>
