import { get } from 'object-path'
import { Context } from 'koa'

import { isEmpty } from '../../core'
import { getClaims } from '../../config'

import { Table } from '../tables'

import { hasuraToVee, sqlToVee, mergeRules } from './transformer'
import { ActionType } from './permissions'
import { UniqueRule, RequiredRule, GenericRule } from './kinds'

export const createRules = (
  table: Table,
  context: Context,
  action: ActionType
) => {
  const permissions = table.userPermissions(context)
  if (permissions && permissions[action]) {
    const rules: GenericRule[] = []
    let filter
    // * Adds the rules from Hasura permissions
    if (action === 'insert') filter = get(permissions, 'insert.check')
    else if (action === 'update') filter = get(permissions, 'update.filter')
    else if (action === 'delete') filter = get(permissions, 'delete.filter')
    if (filter && !isEmpty(filter))
      rules.push(...hasuraToVee(filter, getClaims(context)))

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
    return mergeRules(rules)
  }
}
