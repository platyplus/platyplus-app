/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InterfaceType, ID, Ctx } from 'type-graphql'
import { Context } from 'koa'

import { ObjectMap } from '../../core'

import { Table } from '../tables'
import { GraphQLNode, NodeScope } from '../types'
import { ColumnAction, GenericRule } from '../rules'

@InterfaceType()
export abstract class GenericField implements GraphQLNode {
  abstract toObject(
    context: Context,
    action: ColumnAction,
    scope?: NodeScope
  ): ObjectMap

  table: Table

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

  rules(context: Context, action: 'insert' | 'update' | 'delete') {
    const tableRules = this.table.rules(context, action)
    return tableRules?.filter(rule =>
      rule.paths.find(
        path => path === this.name || path.startsWith(`${this.name}.`)
      )
    )
  }

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

  @Field(type => [GenericRule], { nullable: true })
  insertRules(@Ctx() context: Context) {
    console.warn(
      'This method should be implemented in the classes exending GenericField!!!'
    )
  }

  @Field(type => [GenericRule], { nullable: true })
  updateRules(@Ctx() context: Context) {
    console.warn(
      'This method should be implemented in the classes exending GenericField!!!'
    )
  }

  @Field(type => [GenericRule], { nullable: true })
  deleteRules(@Ctx() context: Context) {
    console.warn(
      'This method should be implemented in the classes exending GenericField!!!'
    )
  }
}
