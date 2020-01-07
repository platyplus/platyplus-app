import { Component, Prop, Mixins } from 'vue-property-decorator'
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

import { GenericObject } from '../types/common'
import { elementAsOption, optionAsElement } from '../modules/metadata'

import { FieldMixin } from './field'

extend('required', required)

@Component
export class FieldEditMixin extends Mixins(FieldMixin) {
  @Prop([String, Object, Boolean, Number, Array])
  public readonly value?: GenericObject

  public get formValue() {
    return elementAsOption(this.value, this.table)
  }
  public set formValue(newValue) {
    this.$emit('input', optionAsElement(newValue))
  }
  public get rules() {
    return {
      // TODO recode
      // required: this.property.required
    }
  }
}
