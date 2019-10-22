import { IdGetterObj } from 'apollo-cache-inmemory'

import { ObjectMap } from '../../types/common'

import { uniqueGraphQlId } from './common'

/** // TODO code the cache operations e.g.:
 * update org_unit.children when another org_unit.parent_id has been changed
 * update the lists (e.g. org_unit, org_unit where XYZ) when an item has been added/deleted
 * etc
 */

/**
 * * Returns the 'Graphql ID' of the object so it can be normalized in the cache.
 * - Generate custom IDs for special object types e.g. table, permission...
 * - If tableClasses are loaded, and if there is more than one primary key column, generate a custom ID
 * - Use the default generated ID otherwise.
 */
export const dataIdFromObject = (object: IdGetterObj) => {
  const obj = object as ObjectMap
  switch (object.__typename) {
    case 'table':
      return `table:${obj.table_schema}.${obj.table_name}`
    case 'permission':
      return `permission:${obj.table_schema}.${obj.table_name}.${obj.role_name}`
    case 'relationship':
      return `relationship:${obj.table_schema}.${obj.table_name}.${obj.name}`
    case 'primary_key':
      // prettier-ignore
      return `primary_key:${obj.table_schema}.${obj.table_name}.${obj.constraint_name}`
    case 'foreign_key_constraint':
      // prettier-ignore
      return `foreign_key_constraint:${obj.table_schema}.${obj.table_name}.${obj.constraint_name}`
    case 'check_constraint':
      // prettier-ignore
      return `check_constraint:${obj.table_schema}.${obj.table_name}.${obj.constraint_name}`
    default:
      return uniqueGraphQlId(obj)
  }
}
