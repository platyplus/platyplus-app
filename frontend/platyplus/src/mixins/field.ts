import { Component, Prop } from 'vue-property-decorator'

import { ObjectMap } from '../types/common'
import { HasuraMixin } from './hasura'

@Component
export class FieldMixin extends HasuraMixin {
  @Prop(String) public readonly property!: string
  @Prop(Object) public readonly element!: ObjectMap

  public get action() {
    return Object.keys(this.element).length == 0 ? 'insert' : 'update'
  }

  public get fieldValue() {
    return this.element[this.property]
  }

  public get propertyMetadata() {
    return this.metadata.fields.find(field => field.name === this.property)
  }

  public get mask() {
    return undefined // TODO
  }
}
