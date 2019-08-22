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
<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { QSelect } from 'quasar'
import { FieldMixin } from './config'

@Component({
  components: {
    QSelect
  }
})
export default class PSelect extends mixins(FieldMixin, QSelect) {
  @Prop({ type: Boolean, default: false }) multiple?: boolean
  @Prop({ type: String, default: 'id' }) optionValue?: string
  @Prop({ type: String, default: 'name' }) optionLabel?: string
  @Prop({ type: Array, default: [] }) options?: {}[]
  @Prop({ type: Boolean, default: false }) required?: boolean

  handleChange(newVal: {}) {
    this.$emit('input', newVal)
  }

  get isReadOnly() {
    return (
      this.readonly ||
      (this.required && this.options && this.options.length === 1)
    )
  }
}
</script>
