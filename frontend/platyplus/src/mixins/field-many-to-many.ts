import { Component, Mixins } from 'vue-property-decorator'

import { ObjectMap, ObjectArray } from '../types/common'
import { elementAsOption, optionAsElement } from '../hasura/graphql/common'

import { FieldRelationshipMixin } from './field-relationship'
import { FieldEditMixin } from './field-edit'

@Component
export class FieldManyToManyMixin extends Mixins(
  FieldRelationshipMixin,
  FieldEditMixin
) {
  public get targetList() {
    const elementValue = this.elementValue as ObjectMap[]
    if (elementValue) {
      if (this.relationship.through) {
        const name = this.relationship.through.name
        return elementValue.map(item => item[name])
      }
    }
    return []
  }

  public get formValue() {
    if (this.value) {
      const through = this.relationship.through
      if (through)
        return (this.value as ObjectMap[]).map(item =>
          elementAsOption(item[through.name], through.reference)
        ) as ObjectArray
    }
    return [] as ObjectArray
  }

  public set formValue(newValue: ObjectArray) {
    if (this.relationship.through) {
      const fromName: string = this.relationship.through.name
      const baseElement = {
        __typename: this.relationship.through.tableClass.name,
        [this.relationship.tableClass.name]: this.element // TODO filter only Ids
      }
      const result =
        newValue &&
        newValue.map(item => ({
          ...baseElement,
          [fromName]: optionAsElement(item)
        }))
      this.$emit('input', result)
    }
  }
}
