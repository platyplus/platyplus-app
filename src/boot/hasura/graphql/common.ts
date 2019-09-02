import { VariableType } from 'json-to-graphql-query'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'
import { ObjectMap } from 'src/types/common'

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
          relationship.reference,
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
