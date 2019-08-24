import { Component, Prop, Mixins } from 'vue-property-decorator'
import { FieldMixin } from './field'
import { GenericObject } from 'src/types/common'

@Component
export class FieldEditMixin extends Mixins(FieldMixin) {
  @Prop([String, Object, Boolean, Number]) public value?: GenericObject

  public get formValue() {
    return this.value
  }
  public set formValue(newValue) {
    this.$emit('input', newValue)
  }
}
