<template lang="pug">
  q-input(
    ref="input"
    v-model="localValue"
    :type="inputType"
    :label="$t(form +'.labels.'+name)"
    :hint="readonly? '': $t(form +'.helpers.'+name)"
    :error-label="readonly? '': $t(form +'.errors.'+name)"
    :readonly="readonly"
    :mask="mask"
    @keyup.enter="enter"
    :key="name"
    :name="name"
    hide-hint)
    template(v-if="icon" v-slot:prepend)
      q-icon(:name="'fas fa-'+icon")
</template>
<script>
import { QInput } from 'quasar'
import { icon, types } from './config'
export default {
  components: {
    QInput
  },
  props: ['enter', 'form', 'name', 'mask', 'readonly', 'errorLabel', 'value'],
  methods: {
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
    },
    localValue: {
      get () {
        return this.value
      },
      set (localValue) {
        this.$emit('input', localValue)
      }
    }
  }
}
</script>
