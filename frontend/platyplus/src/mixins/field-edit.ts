import { Component, Prop, Mixins } from 'vue-property-decorator'
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

import { GenericObject } from 'src/types/common'
import { elementAsOption, optionAsElement } from 'src/hasura/graphql/common'

import { FieldMixin } from './field'

extend('required', required)

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
