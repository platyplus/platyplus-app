import { GenericObject, ObjectArray } from '../../types/common'

import { tableMetadata } from './getters'
import { elementLabel } from '../../composables/metadata'
import { DataObject } from './types/queries'

const uniqueGraphQlId = (object: DataObject) => {
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
  element?: GenericObject
): GenericObject | undefined => {
  if (Array.isArray(element)) {
    return element.map(item => elementAsOption(item)) as ObjectArray
  } else if (element && typeof element === 'object') {
    return {
      ...element,
      _id: uniqueGraphQlId(element),
      _label: elementLabel(element)
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
  option?: DataObject
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

export const isNew = (element: DataObject) =>
  Object.keys(element).length === 0 && Object.keys(element)[0] === '__typename'
