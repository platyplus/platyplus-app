import { Field, ObjectType, registerEnumType } from 'type-graphql'

import { Table } from '../tables'
import { Column } from '../fields'

export enum RelationshipType {
  OBJECT = 'object',
  ARRAY = 'array'
}

registerEnumType(RelationshipType, {
  name: 'RelationshipType',
  description: 'Relationship types'
})

export interface ManualRelationshipConfiguration {
  remote_table: string
  column_mapping: Record<string, string>
}
export type ForeignKeyConstraintDefinition =
  | string
  | { table: string | { name: string; schema: string }; column: string }

export interface RelationshipDefinition {
  foreign_key_constraint_on?: ForeignKeyConstraintDefinition
  manual_configuration?: ManualRelationshipConfiguration
}

@ObjectType({ description: '' })
export class ColumnMapping {
  @Field()
  from: Column
  @Field()
  to: Column
}

// * All the required raw data for building a relationship
export interface RawRelationship {
  name: string
  type: RelationshipType
  definition: RelationshipDefinition
  comment?: string
  mapping: ColumnMapping[]
}

// * Simple interface of a relationship
export interface RelationshipInterface {
  table: Table
  name: string
  component: string
  target: Table
  mapping: ColumnMapping[]
  comment?: string
}
