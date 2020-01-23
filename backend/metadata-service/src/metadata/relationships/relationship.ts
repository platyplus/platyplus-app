import { Field, InterfaceType, Ctx } from 'type-graphql'

import { Table } from '../tables'
import { GenericField } from '../fields'

import {
  RelationshipType,
  RelationshipDefinition,
  ColumnMapping,
  RelationshipInterface
} from './generic'

import { Context } from 'koa'

@InterfaceType()
export abstract class Relationship extends GenericField {
  type: RelationshipType
  definition: RelationshipDefinition
  @Field({ nullable: true })
  comment?: string
  @Field(() => Table)
  target: Table
  @Field(() => [ColumnMapping])
  mapping: ColumnMapping[]
  // TODO inverse
  // ? implement update/insert default?
  constructor({
    table,
    name,
    component,
    target,
    mapping,
    comment
  }: RelationshipInterface) {
    super(table, name, component)
    this.target = target
    this.mapping = mapping
    this.comment = comment
  }
  @Field(() => String, {
    name: 'optionsQuery',
    description:
      'Representation of the GraphQL query of the possible options of the relationship',
    nullable: true
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  optionsQuery(@Ctx() context: Context): string | undefined {
    console.warn(
      'optionsQuery should not be used in the Relationship abstract class'
    )
    return ''
  }
}
