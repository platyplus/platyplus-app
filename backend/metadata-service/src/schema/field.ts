import { Field, InterfaceType, ID } from 'type-graphql'
import { Table } from './table'
import { ObjectMap } from '../core'
import { Context } from 'koa'
import { GraphQLNode, NodeScope } from './common'
import { ColumnAction } from './rules'

@InterfaceType()
export abstract class GenericField implements GraphQLNode {
  abstract toObject(
    context: Context,
    action: ColumnAction,
    scope?: NodeScope
  ): ObjectMap

  table: Table

  @Field(type => ID)
  get id(): string {
    return `${this.table.schema}.${this.table.name}.${this.name}`
  }

  @Field()
  name: string

  @Field()
  kind: string

  constructor(table: Table, name: string, kind: string) {
    this.table = table
    this.name = name
    this.kind = kind
  }
}
