import { Component, Mixins } from 'vue-property-decorator'

import { ObjectArray } from '../types/common'

import { FieldRelationshipMixin } from './field-relationship'
import { FieldEditMixin } from './field-edit'

@Component
export class FieldManyToManyMixin extends Mixins(
  FieldRelationshipMixin,
  FieldEditMixin
) {
  public get targetList() {
    // TODO recode
    // const fieldValue = this.fieldValue as ObjectMap[]
    // if (fieldValue) {
    //   if (this.relationship.through) {
    //     const name = this.relationship.through.name
    //     return fieldValue.map(item => item[name])
    //   }
    // }
    return []
  }

  public get formValue() {
    // TODO recode
    // if (this.value) {
    //   const through = this.relationship.through
    //   if (through)
    //     return (this.value as ObjectMap[]).map(item =>
    //       elementAsOption(item[through.name], through.reference)
    //     ) as ObjectArray
    // }
    return [] as ObjectArray
  }

  public set formValue(newValue: ObjectArray) {
    // TODO recode
    // if (this.relationship.through) {
    //   const fromName: string = this.relationship.through.name
    //   const baseElement = {
    //     __typename: this.relationship.through.tableClass.name,
    //     [this.relationship.tableClass.name]: this.element // TODO filter only Ids
    //   }
    //   const result =
    //     newValue &&
    //     newValue.map(item => ({
    //       ...baseElement,
    //       [fromName]: optionAsElement(item)
    //     }))
    //   this.$emit('input', result)
    // }
  }
}
