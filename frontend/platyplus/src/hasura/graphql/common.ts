import { VariableType } from 'json-to-graphql-query'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'
import { ObjectMap, GenericObject, ObjectArray } from '../../types/common'
import { store } from '../../store'
import { defaultDataIdFromObject } from 'apollo-cache-inmemory'

const graphQlTypes: Record<string, string> = {
  uuid: 'uuid',
  text: 'String',
  bool: 'Boolean'
}
export const graphQlType = (type: string) => graphQlTypes[type] || 'String'

/**
 * * Filters the 'JSON object' and removes the properties that are not permitted with the ability
 * @param tableClass
 * @param jsonObject 'JSON object' as per defined in https://github.com/dupski/json-to-graphql-query
 * @param ability Casl ability
 */
export const filteredJsonObject = (
  tableClass: TableClass,
  jsonObject: ObjectMap,
  ability: Ability
) => {
  const permittedFields = permittedFieldsOf(ability, 'select', tableClass.name)
  const result: ObjectMap = {}
  for (const fieldName of Object.keys(jsonObject)) {
    const subObject = jsonObject[fieldName]
    if (typeof subObject === 'object' && !Array.isArray(subObject)) {
      const relationship = tableClass.getRelationshipProperty(fieldName)
      if (relationship && subObject) {
        const subObjectResult = filteredJsonObject(
          // TODO Improve this ugly M2M hack?
          (relationship.through ? relationship.through : relationship)
            .reference,
          subObject,
          ability
        )
        if (Object.keys(subObjectResult).length)
          result[fieldName] = subObjectResult
      } else result[fieldName] = subObject
    } else if (permittedFields.includes(fieldName)) {
      result[fieldName] = subObject
    }
  }
  return result
}

export const whereCondition = (idColumnNames: string[]) => ({
  _and: idColumnNames.map(name => ({ [name]: { _eq: new VariableType(name) } }))
})

export const idVariables = (tableClass: TableClass) =>
  tableClass.idProperties.reduce<ObjectMap>((result, property) => {
    result[property.name] = graphQlType(property.type) + '!'
    return result
  }, {})

export const uniqueGraphQlId = (object: ObjectMap) => {
  // * Maps the tableClasses 'composed' ids when they are loaded and available from the Vuex store
  if (store && object.__typename) {
    const tableClass: TableClass | undefined = store.getters['hasura/class'](
      object.__typename
    )
    if (tableClass) {
      const idColumnNames = tableClass.idColumnNames
      if (idColumnNames.length > 1)
        // * Generates the ID only for objects with multiple primary key columns
        return `${tableClass.name}:${idColumnNames
          .map(colName => object[colName])
          .join('.')}`
    }
  }
  return defaultDataIdFromObject(object)
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
  tableClass?: TableClass
): GenericObject | undefined => {
  if (Array.isArray(element)) {
    return element.map(item => elementAsOption(item, tableClass)) as ObjectArray
  } else if (element && typeof element === 'object' && tableClass) {
    return {
      ...element,
      _id: uniqueGraphQlId(element as ObjectMap),
      _label: tableClass.label(element as ObjectMap)
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
