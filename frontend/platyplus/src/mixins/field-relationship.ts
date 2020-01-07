import { Component } from 'vue-property-decorator'

import { FieldMixin } from './field'
import { Relationship } from '../modules/metadata/types/objects'

@Component
export class FieldRelationshipMixin extends FieldMixin {
  public get relationship() {
    return this.propertyMetadata as Relationship
  }
}
