import { Field, ObjectType, Ctx } from 'type-graphql'
import { set } from 'object-path'
import { Context } from 'koa'

import { ObjectMap } from '../../core'

import { GenericField } from '../fields'
import { ColumnAction } from '../rules'
import { NodeScope } from '../types'

import { Relationship } from './relationship'

@ObjectType({ implements: [Relationship, GenericField], description: '' })
export class OneToManyRelationship extends Relationship {
  // TODO implement canSelect, Insert, Update
  toObject(context: Context, action: ColumnAction, scope: NodeScope = 'id') {
    const result: ObjectMap = {}
    const fkColumns = this.mapping.map(m => m.to.name)
    if (
      fkColumns.every(fkName =>
        this.target.permittedColumnNames(context, action).includes(fkName)
      )
    ) {
      // TODO only IDs and what's required for the child's label
      set(
        result,
        this.name,
        fkColumns.reduce<ObjectMap>(
          (aggr, curs) => ({ [curs]: true, ...aggr }),
          { ...this.target.toObject(context, action, scope) }
        )
      )
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
  @Field(() => Boolean, { nullable: true })
  canSelect(
    @Ctx()
    context: Context
  ) {
    return this.target.canSelect(context)
  }
  @Field(() => Boolean, { nullable: true })
  canInsert(
    @Ctx()
    context: Context
  ) {
    return this.target.canInsert(context)
  }
  @Field(() => Boolean, { nullable: true })
  canUpdate(
    @Ctx()
    context: Context
  ) {
    return this.target.canUpdate(context)
  }
}
