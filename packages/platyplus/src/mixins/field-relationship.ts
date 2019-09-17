import { Component } from 'vue-property-decorator'

import { RelationshipProperty } from 'src/hasura/schema/properties'

import { FieldMixin } from './field'

@Component
export class FieldRelationshipMixin extends FieldMixin {
  public get relationship() {
    return this.property as RelationshipProperty
  }
}
