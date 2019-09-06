import { Component, Prop, Mixins } from 'vue-property-decorator'
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import { FieldMixin } from './field'
import { GenericObject } from 'src/types/common'
import { elementAsOption, optionAsElement } from '../graphql/common'

extend('required', {
  ...required,
  message: 'The {_field_} is required' // TODO i18n https://codesandbox.io/s/veevalidate-30-vuei18n-integration-9vs4l?from-embed
})

@Component
export class FieldEditMixin extends Mixins(FieldMixin) {
  @Prop([String, Object, Boolean, Number, Array])
  public readonly value?: GenericObject

  public get formValue() {
    return elementAsOption(
      this.value,
      this.property && this.property.tableClass
    )
  }
  public set formValue(newValue) {
    this.$emit('input', optionAsElement(newValue))
  }
  public get rules() {
    return {
      required: this.property.required
    }
  }
}
