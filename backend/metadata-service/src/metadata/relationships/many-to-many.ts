import { Field, ObjectType, Ctx } from 'type-graphql'
import { Context } from 'koa'

import { Table } from '../tables'
import { GenericField } from '../fields'
import { ColumnAction } from '../rules'
import { NodeScope } from '../types'

import { Relationship } from './relationship'
import { RelationshipInterface, ColumnMapping } from './generic'

// * Interface of a ManyToMany relationship
interface ManyToManyRelationshipInterface extends RelationshipInterface {
  through: Table
  throughMapping: ColumnMapping[]
}

@ObjectType({ implements: [Relationship, GenericField], description: '' })
// TODO implement canSelect, Insert, Update
export class ManyToManyRelationship extends Relationship
  implements ManyToManyRelationshipInterface {
  @Field(() => Table)
  through: Table
  @Field(() => [ColumnMapping])
  throughMapping: ColumnMapping[]

  constructor(initialData: ManyToManyRelationshipInterface) {
    super(initialData)
    this.through = initialData.through
    this.throughMapping = initialData.throughMapping
  }

  toObject(context: Context, action: ColumnAction, scope: NodeScope = 'id') {
    // TODO mock code, to be rewritten
    return {
      [this.name]: this.table
        .permittedColumnNames(context, action)
        .includes(this.name)
    }
  }

  @Field(() => String, { nullable: true })
  optionsQuery(@Ctx() context: Context) {
    return this.target.listQuery(context)
  }

  originProperty() {
    return this.through.relationships.find(
      relationship => relationship.target.name === this.table.name
    )
  }
  targetProperty() {
    return this.through.relationships.find(
      relationship => relationship.target.name === this.target.name
    )
  }

  @Field(() => String)
  targetPropertyName() {
    return this.targetProperty()?.name
  }

  @Field(() => String)
  originPropertyName() {
    return this.originProperty()?.name
  }
}
