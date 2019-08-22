<template lang="pug">
  q-input(
    :autocomplete="autocomplete"
    :autofocus="autofocus"
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
<script lang="ts">
import { QInput } from 'quasar'
import { types, FieldMixin } from './config'
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
@Component({
  components: {
    QInput
  }
})
export default class PInput extends mixins(FieldMixin) {
  @Prop(String) autocomplete?: string
  @Prop(String) mask?: string
  @Prop({ type: Boolean, default: false }) autofocus?: boolean

  get inputType() {
    return (this.name && types[this.name]) || 'text'
  }
}
</script>
