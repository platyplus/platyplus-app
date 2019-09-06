import { Component } from 'vue-property-decorator'
import { FieldMixin } from './field'
import { RelationshipProperty } from '../schema/properties'

@Component
export class FieldRelationshipMixin extends FieldMixin {
  public get relationship() {
    return this.property as RelationshipProperty
  }
}
