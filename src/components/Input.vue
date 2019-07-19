<template lang="pug">
  q-input(
    ref="input"
    v-model="localValue"
    :type="inputType"
    :label="$t(form +'.labels.'+name)"
    :hint="hint"
    :error-label="errorLabel"
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
import { isEmpty } from 'lodash'
export default {
  name: 'PInput',
  components: {
    QInput
  },
  props: ['enter', 'form', 'name', 'mask', 'readonly', 'value'],
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
    },
    hint () {
      if (!isEmpty(this.readonly)) {
        return this.$t(this.form + '.helpers.' + this.name)
      } else return undefined
    },
    errorLabel () {
      if (!isEmpty(this.readonly)) {
        return this.$t(this.form + '.errors.' + this.name)
      } else return undefined
    }
  }
}
</script>
