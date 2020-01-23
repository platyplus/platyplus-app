import { Field, ObjectType, ID, registerEnumType } from 'type-graphql'

import { Table, tables } from '../tables'

enum Action {
  NO_ACTION = 'a',
  RESTRICT = 'r',
  CASCADE = 'c',
  SET_NULL = 'n',
  SET_DEFAULT = 'd'
}

registerEnumType(Action, {
  name: 'Action',
  description: 'Actions triggered on foreign key update or delete'
})

@ObjectType({ description: 'Columns of an SQL table' })
export class ForeignKey {
  table: Table
  ref_name: string
  @Field(type => Action, { name: 'onUpdate' })
  on_update: Action
  @Field(type => Action, { name: 'onDelete' })
  on_delete: Action
  mapping: Record<string, string>

  private _reference: Table
  @Field(type => Table)
  get reference() {
    if (!this._reference) {
      this._reference = tables.find(
        table => table.name === this.ref_name
      ) as Table
    }
    return this._reference
  }

  @Field(type => ID)
  get id(): string {
    return `${this.table.name}.${this.ref_name}`
  }
}
