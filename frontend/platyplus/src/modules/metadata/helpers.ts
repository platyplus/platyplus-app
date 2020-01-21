import { tableMetadata } from './getters'
import { DataObject } from './types'

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

export const isNew = (element: DataObject) =>
  Object.keys(element).length === 1 && Object.keys(element)[0] === '__typename'
