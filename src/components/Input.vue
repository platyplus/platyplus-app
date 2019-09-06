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
import { Prop, Vue, Component } from 'vue-property-decorator'
import { icon } from 'src/helpers'

const types: { [key: string]: string } = {
  password: 'password'
}

@Component({
  components: {
    QInput
  }
})
export default class PInput extends Vue {
  @Prop(String) readonly autocomplete?: string
  @Prop(String) readonly mask?: string
  @Prop({ type: Boolean, default: false }) readonly autofocus!: boolean
  @Prop(Function) readonly enter?: Function
  @Prop(String) readonly form!: string
  @Prop(String) readonly name!: string
  @Prop({ type: Boolean, default: false }) readonly readonly!: boolean
  @Prop([Object, String]) readonly value?: {} | string

  public get localValue() {
    return this.value
  }

  public set localValue(newValue) {
    this.$emit('input', newValue)
  }

  public get icon() {
    return icon(this.form, this.name)
  }

  get inputType() {
    return types[this.name] || 'text'
  }
}
</script>
