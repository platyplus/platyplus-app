import { IdGetterObj } from 'apollo-cache-inmemory'
import { defaultDataIdFromObject } from 'apollo-cache-inmemory'

import { ObjectMap } from './types'

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
  if (typeof object.__typename === 'string' && !object.id) {
    const subIds = Object.keys(object).filter(key => key.endsWith('_id'))
    if (subIds.length > 0)
      return `${object.__typename}:${subIds
        .map(key => (object as ObjectMap)[key])
        .join('.')}`
    // if ((object as ObjectMap).name)
    //   return `${object.__typename}:${(object as ObjectMap).name}`
  }
  return defaultDataIdFromObject(object)
}
