import {
  jsonToGraphQLQuery,
  VariableType,
  EnumType
} from 'json-to-graphql-query'
import gql from 'graphql-tag'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'
import { ObjectMap } from 'src/types/common'
import { RelationshipProperty } from '../schema/properties'
import { get } from 'object-path'

const graphQlTypes: Record<string, string> = {
  uuid: 'uuid',
  text: 'String',
  bool: 'Boolean'
}
const graphQlType = (type: string) => graphQlTypes[type] || 'String'

/**
 * * Filters the 'JSON object' and removes the properties that are not permitted with the ability
 * @param tableClass
 * @param jsonObject 'JSON object' as per defined in https://github.com/dupski/json-to-graphql-query
 * @param ability Casl ability
 */
const filteredJsonObject = (
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

export const listQuery = (tableClass: TableClass, ability: Ability) =>
  gql(
    jsonToGraphQLQuery(
      {
        query: {
          [tableClass.name]: filteredJsonObject(
            tableClass,
            tableClass.jsonObjectList,
            ability
          )
        }
      },
      { pretty: true }
    )
  )

// TODO customiser? This query is supposed to fetch all the possible options that can be used.
// TODO The dynamic filter should then occur on the client side.
export const optionsQuery = (
  property: RelationshipProperty,
  ability: Ability
) => listQuery(property.reference, ability)

const whereCondition = (idColumnNames: string[]) => ({
  _and: idColumnNames.map(name => ({ [name]: { _eq: new VariableType(name) } }))
})
const idVariables = (tableClass: TableClass) =>
  tableClass.idProperties.reduce<ObjectMap>((result, property) => {
    result[property.name] = graphQlType(property.type) + '!'
    return result
  }, {})

export const readQuery = (tableClass: TableClass, ability: Ability) =>
  gql(
    jsonToGraphQLQuery(
      {
        query: {
          __variables: idVariables(tableClass),
          [tableClass.name]: {
            __args: {
              where: whereCondition(tableClass.idColumnNames)
            },
            ...filteredJsonObject(
              tableClass,
              tableClass.jsonObjectElement,
              ability
            )
          }
        }
      },
      { pretty: true }
    )
  )

/**
 *
 * @param tableClass
 * @param ability
 * ! Don't forget to check the ability against the element value before mutating!
 */
// TODO finish this up: Upsert + many-to-many relationships
export const upsertMutation = (
  tableClass: TableClass,
  ability: Ability,
  action: string = 'update'
) => {
  const idFields = tableClass.idColumnNames
  const permittedEditFields = permittedFieldsOf(
    ability,
    action,
    tableClass.name
  ).filter(field => !idFields.includes(field))
  const allFields = [...permittedEditFields, ...idFields]
  const variableProperties = tableClass.properties.filter(property =>
    allFields.includes(property.name)
  )
  const mutation = {
    mutation: {
      __variables: variableProperties.reduce<Record<string, string>>(
        (result, property) => {
          result[property.name] = graphQlType(property.type)
          if (idFields.includes(property.name) || property.required)
            result[property.name] += '!' // Flag any primary key or (non nullable + no default) field as required
          return result
        },
        {}
      ),
      [`insert_${tableClass.name}`]: {
        __args: {
          objects: [
            allFields.reduce<Record<string, VariableType>>((result, name) => {
              result[name] = new VariableType(name)
              return result
            }, {})
          ],
          // eslint-disable-next-line @typescript-eslint/camelcase
          on_conflict: {
            constraint: new EnumType(
              get(tableClass.table, 'primary_key.constraint_name')
            ),
            // eslint-disable-next-line @typescript-eslint/camelcase
            update_columns: permittedEditFields.map(name => new EnumType(name))
          }
        },
        // ! Returns the entire 'element' query - may be a bit too much
        returning: filteredJsonObject(
          tableClass,
          tableClass.jsonObjectElement,
          ability
        )
      }
    }
  }
  return gql(jsonToGraphQLQuery(mutation, { pretty: true }))
}

export const deleteMutation = (tableClass: TableClass, ability: Ability) =>
  gql(
    jsonToGraphQLQuery(
      {
        mutation: {
          __variables: idVariables(tableClass),
          [`delete_${tableClass.name}`]: {
            __args: {
              where: whereCondition(tableClass.idColumnNames)
            },
            returning: filteredJsonObject(
              tableClass,
              tableClass.jsonObjectElement,
              ability
            )
          }
        }
      },
      {
        pretty: true
      }
    )
  )
