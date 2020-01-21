/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InterfaceType, ID, Ctx } from 'type-graphql'
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

  @Field(() => Boolean, { nullable: true })
  canSelect(@Ctx() context: Context) {
    console.warn(
      'This method should be implemented in the classes exending GenericField!!!'
    )
    return false
  }

  @Field(() => Boolean, { nullable: true })
  canInsert(@Ctx() context: Context) {
    console.warn(
      'This method should be implemented in the classes exending GenericField!!!'
    )
    return false
  }

  @Field(() => Boolean, { nullable: true })
  canUpdate(@Ctx() context: Context) {
    console.warn(
      'This method should be implemented in the classes exending GenericField!!!'
    )
    return false
  }

  @Field(() => ID)
  get id(): string {
    return `${this.table.name}.${this.name}`
  }

  @Field()
  name: string

  @Field()
  component: string

  constructor(table: Table, name: string, component: string) {
    this.table = table
    this.name = name
    this.component = component
  }
}
