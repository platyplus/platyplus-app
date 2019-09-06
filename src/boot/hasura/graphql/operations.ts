import {
  jsonToGraphQLQuery,
  VariableType,
  EnumType
} from 'json-to-graphql-query'
import gql from 'graphql-tag'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'
import { RelationshipProperty } from '../schema/properties'
import { get } from 'object-path'
import {
  idVariables,
  whereCondition,
  filteredJsonObject,
  graphQlType
} from './common'

// TODO it became useless to add the foreign key columns to the queries. Think about removing them
// TODO example: org_unit { parent_id, parent { id } } -> org_unit { parent { id } } is enough

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

export const elementQuery = (tableClass: TableClass, ability: Ability) =>
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

// TODO customiser? This query is supposed to fetch all the possible options that can be used.
// TODO The dynamic filter should then occur on the client side.
export const optionsQuery = (
  property: RelationshipProperty,
  ability: Ability
) =>
  listQuery(
    property.through ? property.through.reference : property.reference,
    ability
  )

/**
 *
 * @param tableClass
 * @param ability
 * ! Don't forget to check the ability against the element value before mutating!
 */
// TODO finish this up: Upsert + many-to-many relationships
// TODO split upsert into insert/update
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
