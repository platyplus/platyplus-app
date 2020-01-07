import template from 'lodash.template'

import { ObjectMap, GenericObject, ObjectArray } from '../../types/common'

import { Table } from './types/objects'
import { tableMetadata } from './getters'

export const label = (table: Partial<Table>, element: ObjectMap) => {
  const compiledTemplate = template(table.label?.template)
  return compiledTemplate(element)
}

const uniqueGraphQlId = (object: ObjectMap) => {
  if (typeof object.__typename === 'string') {
    try {
      // * Maps the table classes 'composed' ids
      const table = tableMetadata(object.__typename)
      // * Generates the ID for objects with multiple primary key columns
      return `${table?.name}:${table?.idFields
        ?.map(field => object[field.name])
        .join('.')}`
      //   }
    } catch {
      throw Error(
        `Impossible to generate an unique ID: metadata for ${object.__typename} not found`
      )
    }
  } else
    throw Error(
      `Impossible to generate an unique ID: __typename is not a string: ${JSON.stringify(
        object.__typename
      )}`
    )
}

/**
 * * This function adds two generated fields to an element:
 * _label, based on the template of the property
 * _id, baed on the primary key fields of the property.
 * This function is used to create a standard label and a standard key
 * regardless of the underlying table class
 * @param element
 * @param property
 */
export const elementAsOption = (
  element?: GenericObject,
  table?: string,
  schema = 'public'
): GenericObject | undefined => {
  if (Array.isArray(element)) {
    return element.map(item => elementAsOption(item, table)) as ObjectArray
  } else if (element && typeof element === 'object' && table) {
    return {
      ...element,
      _id: uniqueGraphQlId(element),
      _label: label(tableMetadata(table, schema), element)
    }
  }
  return element
}

/**
 * * Converts an 'option element' that has been enriched by the above function
 * * in removing the _id and _label fields
 * @param option
 */
export const optionAsElement = (
  option?: GenericObject
): GenericObject | undefined => {
  if (Array.isArray(option)) {
    return option.map(item => optionAsElement(item)) as ObjectArray
  } else if (option && typeof option === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _label, ...result } = option
    return result
  }
  return option
}
