import { Field, ObjectType } from 'type-graphql'
import { Column } from './columns'
import { ObjectMap, isEmpty } from '../core'
import { Table } from './table'
import { Rule as SqlRule, hasuraToVee, sqlToVee } from '../rule-transform'
import { get } from 'object-path'
import { Context } from 'koa'
import { getClaims } from '../config'
interface FilterPermissionComponent {
  filter: ObjectMap
}
interface ColumnsPermissionComponent {
  columns: string[] | '*'
}
interface SetPermissionsComponent {
  set: Record<string, string>
}

type SelectPermission = FilterPermissionComponent &
  ColumnsPermissionComponent & {
    computed_fields: string[]
    allow_aggregations?: boolean
  }

type InsertPermission = ColumnsPermissionComponent &
  SetPermissionsComponent & {
    check: ObjectMap
  }

type UpdatePermission = ColumnsPermissionComponent &
  SetPermissionsComponent &
  FilterPermissionComponent

type DeletePermission = FilterPermissionComponent

export interface Permission {
  role: string
  select?: SelectPermission
  insert?: InsertPermission
  update?: UpdatePermission
  delete?: DeletePermission
}

export class Check {
  table: Table
  name: string
  check: string
}

export interface UniqueConstraint {
  name: string
  columns: string[]
}

export type UpsertAction = 'insert' | 'update'
export type ColumnAction = UpsertAction | 'select'
export type MutationAction = UpsertAction | 'delete'
export type ActionType = MutationAction | 'select'

@ObjectType({ description: 'Rule' })
export class Rule implements SqlRule {
  // TODO figure out how to set an ID. By default, it can be a generated uuid on instanciation, but it won't be peristent over time...
  @Field(type => String)
  type: string
  @Field(type => [String])
  parameters: string[]
  @Field(type => [String])
  paths: string[] // ? Not sure this is the information the client needs. E.g. to get nested fields "object.id" would be more helpful. Then rename 'columns' to 'paths'?

  constructor(
    type?: string,
    parameters: string[] | string = [],
    paths: string[] = []
  ) {
    if (type) this.type = type
    this.parameters = typeof parameters === 'string' ? [parameters] : parameters
    this.paths = paths
  }
}

export class RequiredRule extends Rule {
  constructor(column: Column) {
    super('required', undefined, [column.name])
  }
}

export class UniqueRule extends Rule {
  constructor(constraint: UniqueConstraint) {
    super('unique', constraint.columns, constraint.columns)
  }
}

export const createRules = (
  table: Table,
  context: Context,
  action: ActionType
) => {
  const permissions = table.userPermissions(context)
  if (permissions && permissions[action]) {
    const rules: Rule[] = []
    let filter
    // * Adds the rules from Hasura permissions
    if (action === 'insert') filter = get(permissions, 'insert.check')
    else if (action === 'update') filter = get(permissions, 'update.filter')
    else if (action === 'delete') filter = get(permissions, 'delete.filter')
    if (filter && !isEmpty(filter))
      rules.push(hasuraToVee(filter, getClaims(context)))

    // * Adds the rules from the check constraints
    for (const check of table.checks) rules.push(...sqlToVee(check.check))

    if (action === 'insert' || action === 'update') {
      const columnNames = table.permittedColumnNames(context, action)
      // * Adds an 'unique' rule for every primary key and for every unique constraint
      for (const constraint of table.constraints)
        rules.push(new UniqueRule(constraint))
      // * Adds a 'required' rule for each allowed column that is not nullable
      // * Also includes the columns with defaults, because the client should know that the column is required
      for (const column of table.columns.filter(
        c => columnNames.includes(c.name) && c.nullable === false
      ))
        rules.push(new RequiredRule(column))
    }
    return rules
  }
}
