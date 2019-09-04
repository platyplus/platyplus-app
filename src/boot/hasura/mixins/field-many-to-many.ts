import { Component } from 'vue-property-decorator'
import { RelationshipProperty } from '../schema/properties'
import { ObjectMap } from 'src/types/common'
import { FieldMixin } from './field'

@Component
export class FieldManyToManyMixin extends FieldMixin {
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
}
