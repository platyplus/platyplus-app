<template lang="pug">
  q-select(
    v-model="localValue"
    :label="$t(form +'.labels.'+name)"
    :hint="isReadOnly? '': $t(form +'.helpers.'+name)"
    :error-label="isReadOnly? '': $t(form +'.errors.'+name)"
    :readonly="isReadOnly"
    :options="options"
    :multiple="multiple"
    hide-hint
    :hide-dropdown-icon="isReadOnly"
    :option-value="optionValue"
    :option-label="optionLabel"
    stack-label
    emit-value
    map-options
    :clearable="!required"
    filter)
    template(v-if="icon" v-slot:prepend)
      q-icon(:name="'fas fa-'+icon")
    template(v-if="multiple" v-slot:selected-item="scope")
      q-chip(
        dense
        :removable="!isReadOnly"
        @remove="scope.removeAtIndex(scope.index)"
        tabindex="scope.tabindex") {{ scope.opt[optionLabel] }}
</template>
<script>
import { QSelect } from 'quasar'
import { FieldMixin } from './config'

export default {
  extends: QSelect,
  mixins: [FieldMixin],
  components: {
    QSelect
  },
  props: {
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
    options: Array,
    required: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange (newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    isReadOnly () {
      return this.readonly || (this.required && this.options.length === 1)
    }
  }
}
</script>
