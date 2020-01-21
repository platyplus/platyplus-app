import { Field, ObjectType, Ctx, Arg } from 'type-graphql'
import { Context } from 'koa'

import { sqlToLodash } from '../rule-transform'

import { GenericField } from './field'
import { Table } from './table'
import { Rule, ColumnAction } from './rules'
import { getRole, getClaims } from '../config'
import { get } from 'object-path'
import { isEmpty } from '../core'

export interface RawColumn {
  name: string
  type: string
  domain?: string
  default?: string
  nullable: boolean
}

const graphQLTypes = new Map([
  ['uuid', 'uuid'],
  ['text', 'String'],
  ['bool', 'Boolean'],
  ['ltree', 'String']
])
const graphQLType = (type: string) => graphQLTypes.get(type) || type

const componentKinds = new Map([
  ['uuid', 'text'], // ? Keep that way ?
  ['text', 'text'],
  ['bool', 'boolean'],
  ['timestamptz', 'datetime'],
  ['ltree', 'text'],
  ['jsonb', 'json']
])

const componentKind = ({ name, type }: RawColumn) => {
  if (['created_at', 'updated_at'].includes(name)) return 'hidden'
  return componentKinds.get(type) || type
}
@ObjectType({
  implements: GenericField,
  description: 'Columns of an SQL table'
})
export class Column extends GenericField {
  constructor(
    table: Table,
    { name, type, domain, default: defaultValue, nullable }: RawColumn
  ) {
    super(
      table,
      name,
      componentKind({ name, type, domain, default: defaultValue, nullable })
    )
    this.type = graphQLType(type)
    this.domain = domain
    this.default = defaultValue
    this.nullable = nullable
  }

  // Additionnal properties exposed in GraphQL
  @Field()
  type: string // TODO what is that?
  @Field({ nullable: true })
  domain?: string // TODO what is that?
  default?: string
  @Field()
  nullable: boolean // TODO dig into that one

  // TODO: return false if not selectable
  toObject(context: Context, action: ColumnAction) {
    return {
      [this.name]: this.table
        .permittedColumnNames(context, action)
        .includes(this.name)
    }
  }

  private getPermission(
    context: Context,
    action: 'insert' | 'update' | 'select' | 'delete'
  ) {
    const role = getRole(context)
    return this.table.permissions.find(
      permission => permission.role === role && permission[action]
    )
  }

  private getColumnPreset(
    context: Context,
    action: 'insert' | 'update' | 'select' | 'delete'
  ) {
    // TODO test this method
    const permission = this.getPermission(context, action)
    if (permission) {
      // * Returns the value of the 'column preset' if it has been defined in the insert/update permission
      const columnPresets = get(permission, `${action}.set`) as
        | Record<string, string>
        | undefined
      if (
        columnPresets &&
        !isEmpty(columnPresets) &&
        columnPresets[this.name]
      ) {
        const result = columnPresets[this.name]
        // * Lookup the column preset in the session variables. If not, return the column preset
        if (result.toLowerCase().startsWith('x-hasura')) {
          const claims = getClaims(context)
          return claims[result.toLowerCase()] || result
        } else return result
      }
    }
  }

  private getDefault(context: Context, action: 'insert' | 'update') {
    // * Returns the value of the 'column preset' if it has been defined in the insert/update permission
    // * Or else, returns the default value
    return (
      this.getColumnPreset(context, action) ||
      (this.default && sqlToLodash(this.default))
    )
    // TODO case of updated_at: insertDefault and updateDefault are currently now()
  }

  @Field(type => String, { nullable: true })
  insertDefault(@Ctx() context: Context) {
    return this.getDefault(context, 'insert')
  }

  @Field(type => String, { nullable: true })
  updateDefault(@Ctx() context: Context) {
    return this.getDefault(context, 'update')
  }

  /**
   * Informs whether the field is readonly or not for the given action.
   * A field is read-only if there are no existing permission for the user role,
   * or if the field is not part of the columns of the action permission,
   * ? or if the action permission set a column preset ?
   * @param context
   * @param action
   */
  private canAction(context: Context, action: 'insert' | 'update' | 'select') {
    const permission = this.getPermission(context, action)
    if (permission) {
      // ? set readonly to 'true' if a 'column preset' has been defined in the insert/update permission
      // if (this.getColumnPreset(context, action)) return true
      // else {
      // * Set readonly to 'true' if the column not in the insert/update permission columns
      const actionnableColumns = get(permission, `${action}.columns`) as
        | string
        | string[]
        | undefined
      if (actionnableColumns === '*') return false
      else if (
        Array.isArray(actionnableColumns) &&
        actionnableColumns.includes(this.name)
      )
        return true
      else return false
      // }
    } else return false // * Set readonly to true if no permission has been found at all
  }

  @Field(type => Boolean, { nullable: true })
  canSelect(@Ctx() context: Context) {
    return this.canAction(context, 'select')
  }

  @Field(type => Boolean, { nullable: true })
  canInsert(@Ctx() context: Context) {
    return this.canAction(context, 'insert')
  }

  @Field(type => Boolean, { nullable: true })
  canUpdate(@Ctx() context: Context) {
    return this.canAction(context, 'update')
  }

  private rules(
    @Ctx() context: Context,
    @Arg('action') action: 'insert' | 'update' | 'delete'
  ) {
    if (
      action != 'delete' &&
      !this.table.permittedColumnNames(context, action).includes(this.name)
    )
      return null
    const tableRules = this.table.rules(context, action)
    return (
      tableRules &&
      tableRules.filter(rule =>
        rule.paths.find(
          path => path === this.name || path.startsWith(`${this.name}.`)
        )
      )
    )
  }

  @Field(type => [Rule], { nullable: true })
  insertRules(@Ctx() context: Context) {
    return this.rules(context, 'insert')
  }

  @Field(type => [Rule], { nullable: true })
  updateRules(@Ctx() context: Context) {
    return this.rules(context, 'update')
  }

  @Field(type => [Rule], { nullable: true })
  deleteRules(@Ctx() context: Context) {
    return this.rules(context, 'delete')
  }
}
