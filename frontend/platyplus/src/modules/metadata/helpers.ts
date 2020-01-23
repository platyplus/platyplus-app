import { template } from 'lodash'

import { tableMetadata } from './getters'
import { DataObject, Rule } from './types'

export const uniqueGraphQlId = (object: DataObject) => {
  try {
    // * Maps the table classes 'composed' ids
    const table = tableMetadata(object.__typename)
    // * Generates the ID for objects with multiple primary key columns
    return `${table.name}:${table.idFields
      .map(field => object[field.name])
      .join('.')}`
    //   }
  } catch {
    throw Error(
      `Impossible to generate an unique ID: metadata for ${object.__typename} not found`
    )
  }
}

export const validateRule = (element: DataObject, rule: Rule) => {
  if (rule.type === 'lodash')
    return !!JSON.parse(template(rule.parameters[0])(element))
  return true // TODO code other rules
}

export const validateRules = (
  element: DataObject,
  rules: Rule[] | null | undefined
) => (rules ? rules.every(rule => validateRule(element, rule)) : true)
