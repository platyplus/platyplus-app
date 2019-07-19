<template lang="pug">
  q-input(
    ref="input"
    v-model="localValue"
    :type="inputType"
    :label="$t(form +'.labels.'+name)"
    :hint="readonly ? '' : $t(form +'.helpers.'+name)"
    :error-label="readonly ? '' : $t(form +'.errors.'+name)"
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
import { types, FieldMixin } from './config'
export default {
  name: 'PInput',
  components: {
    QInput
  },
  mixins: [FieldMixin],
  props: ['mask', 'value'],
  methods: {
    focus () {
      // TODO
      if (!this.readonly) this.$refs.input.focus()
    }
  },
  computed: {
    inputType () {
      return types[this.name] || 'text'
    }
  }
}
</script>
