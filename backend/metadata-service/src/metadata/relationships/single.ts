import { Field, ObjectType, Ctx } from 'type-graphql'
import { set } from 'object-path'
import { Context } from 'koa'

import { ObjectMap } from '../../core'

import { GenericField } from '../fields'
import { ColumnAction, GenericRule } from '../rules'
import { NodeScope } from '../types'

import { Relationship } from './relationship'

@ObjectType({ implements: [Relationship, GenericField], description: '' })
export class SingleRelationship extends Relationship {
  toObject(context: Context, action: ColumnAction, scope: NodeScope = 'id') {
    let result: ObjectMap = {}
    const fkColumns = this.mapping.map(m => m.from.name)
    if (
      fkColumns.every(fkName =>
        this.table.permittedColumnNames(context, 'select').includes(fkName)
      )
    ) {
      result = fkColumns.reduce<ObjectMap>(
        (aggr, curs) => ({ [curs]: true, ...aggr }),
        {}
      )
      // TODO only IDs and what's required for the child's label
      set(result, this.name, this.target.toObject(context, action, scope))
    }
    return result
  }
  @Field(() => String, { nullable: true })
  optionsQuery(
    @Ctx()
    context: Context
  ) {
    return this.target.listQuery(context)
  }
  get idFields() {
    const idFieldNames = this.mapping.map(item => item.from.name)
    return this.table.columns.filter(column =>
      idFieldNames.includes(column.name)
    )
  }
  @Field(() => Boolean, { nullable: true })
  canSelect(
    @Ctx()
    context: Context
  ) {
    return (
      this.idFields.every(field => field.canSelect(context)) &&
      this.target.canSelect(context)
    )
  }
  @Field(() => Boolean, { nullable: true })
  canInsert(
    @Ctx()
    context: Context
  ) {
    return (
      this.idFields.every(field => field.canInsert(context)) &&
      this.target.canInsert(context)
    )
  }
  @Field(() => Boolean, { nullable: true })
  canUpdate(
    @Ctx()
    context: Context
  ) {
    return (
      this.idFields.every(field => field.canUpdate(context)) &&
      this.target.canUpdate(context)
    )
  }
  @Field(type => [GenericRule], { nullable: true })
  insertRules(
    @Ctx()
    context: Context
  ) {
    return this.rules(context, 'insert')
  }
  @Field(type => [GenericRule], { nullable: true })
  updateRules(
    @Ctx()
    context: Context
  ) {
    return this.rules(context, 'update')
  }
  @Field(type => [GenericRule], { nullable: true })
  deleteRules(
    @Ctx()
    context: Context
  ) {
    return this.rules(context, 'delete')
  }
}
