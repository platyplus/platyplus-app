<template lang="pug">
  q-select(
    :value="value"
    @input="handleChange"
    :label="$t(form +'.labels.'+name)"
    :hint="$t(form +'.helpers.'+name)"
    :error-label="$t(form +'.errors.'+name)"
    :readonly="readonly"
    :options="options"

    :multiple="multiple"
    :use-chips="multiple"
    hide-hint
    :option-value="optionValue"
    :option-label="optionLabel"
    stack-label
    emit-value
    map-options
    filter
    )
    template(v-if="icon" v-slot:prepend)
      q-icon(:name="'fas fa-'+icon")
</template>
<script>
import { QSelect } from 'quasar'
import { icon, types } from './config'

export default {
  extends: QSelect,
  components: {
    QSelect
  },
  props: {
    enter: Function,
    form: String,
    name: String,
    multiple: {
      type: Boolean,
      default: false
    },
    optionValue: {
      default: 'id'
    },
    optionLabel: {
      default: 'name'
    },
    options: Array
  },
  methods: {
    handleChange (newVal) {
      console.log('input')
      this.$emit('input', newVal)
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
