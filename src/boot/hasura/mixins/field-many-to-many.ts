import { Component } from 'vue-property-decorator'
import { RelationshipProperty } from '../schema/properties'
import { ObjectMap, ObjectArray } from 'src/types/common'
import { FieldEditMixin } from './field-edit'
import { elementAsOption, optionAsElement } from '../graphql/common'

@Component
export class FieldManyToManyMixin extends FieldEditMixin {
  public get targetList() {
    const elementValue = this.elementValue as ObjectMap[]
    if (elementValue && this.property && 'through' in this.property) {
      const relationship = this.property as RelationshipProperty
      if (relationship.through) {
        const name = relationship.through.name
        return elementValue.map(item => item[name])
      }
    }
    return []
  }

  public get formValue() {
    if (this.value && this.property) {
      const through = (this.property as RelationshipProperty)
        .through as RelationshipProperty
      return (this.value as ObjectMap[]).map(item =>
        elementAsOption(item[through.name], through.reference)
      ) as ObjectArray
    }
    return [] as ObjectArray
  }

  public set formValue(newValue: ObjectArray) {
    const property = this.property as RelationshipProperty
    if (property && property.through) {
      const fromName: string = property.through.name
      const baseElement = {
        __typename: property.through.tableClass.name,
        [property.tableClass.name]: this.element // TODO filter only Ids
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
