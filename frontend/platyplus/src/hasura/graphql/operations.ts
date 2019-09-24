import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query'
import gql from 'graphql-tag'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'
import { RelationshipProperty, ColumnProperty } from '../schema/properties'
import { get, set } from 'object-path'
import {
  idVariables,
  whereCondition,
  filteredJsonObject,
  graphQlType
} from './common'
import { ObjectMap } from 'src/types/common'
import { ability } from '../ability'
import { apolloClient } from '@platyplus/hasura-apollo-client'

// TODO it became useless to add the foreign key columns to the queries. Think about removing them
// TODO example: org_unit { parent_id, parent { id } } -> org_unit { parent { id } } is enough
// TODO add max(updated_at) + index on updated_at so it can work with the subscribeToMore
export const listQuery = (tableClass: TableClass, ability: Ability) =>
  gql(
    jsonToGraphQLQuery(
      {
        query: {
          [`${tableClass.name}_aggregate`]: {
            aggregate: {
              max: {
                // eslint-disable-next-line @typescript-eslint/camelcase
                updated_at: true
              }
            },
            nodes: filteredJsonObject(
              tableClass,
              tableClass.jsonObjectList,
              ability
            )
          }
        }
      },
      { pretty: true }
    )
  )

// TODO listSubsriptionToMore with filter where: { updated_at: { _gt: $}}
// TODO merge listQuery and elementQuery?????
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
// ??? Use readFragment instead?!
export const optionsQuery = (
  property: RelationshipProperty,
  ability: Ability
) =>
  listQuery(
    property.through ? property.through.reference : property.reference,
    ability
  )

// * Forces the primary key fields from the initial element, or set their default values
const generateDefaultId = (tableClass: TableClass, element: ObjectMap) => {
  const result: ObjectMap = {}
  for (const property of tableClass.idProperties) {
    set(
      result,
      property.name,
      get(element, property.name, property.generateDefault())
    )
  }
  return result
}

const createVariables = (
  tableClass: TableClass,
  element: ObjectMap,
  changes: ObjectMap
) => {
  const action = Object.keys(element).length > 0 ? 'update' : 'insert'
  // if (Object.keys(form).length > 0) {
  const variables: ObjectMap = {}
  const permittedFields = permittedFieldsOf(ability, action, tableClass.name)
  for (const property of tableClass.properties) {
    if (property.isColumn) {
      // * Copies the non ID, non reference, permitted fields
      const column = property as ColumnProperty
      if (
        !column.isId &&
        !column.isReference &&
        permittedFields.includes(column.name) &&
        changes[column.name]
      ) {
        set(variables, column.name, changes[column.name])
      }
    } else {
      const relationship = property as RelationshipProperty
      if (relationship.isMultiple) {
        // TODO multiple
        if (relationship.isSimpleManyToMany) {
          console.log('TODO M2M')
        }
      } else {
        // TODO if the nested object changed, upsert it
        if (relationship.isOwnedByClass) {
          // TODO if the nested object changed and it is existing in this.element, delete it
          console.log('TODO: object owned by class +- nested insert/update')
        } else {
          // * Copies the foreign keys of the many-to-one relationships
          for (const map of relationship.mapping) {
            const value = get(changes, `${relationship.name}.${map.to.name}`)
            if (value !== undefined) set(variables, map.from.name, value)
          }
        }
      }
    }
  }
  return variables
}

export const saveMutation = async (
  // ? no real need to do async anymore
  tableClass: TableClass,
  originalElement: ObjectMap,
  newElement: ObjectMap,
  changes: ObjectMap // ? what to to with that? Kind of duplicates the above?
) => {
  const idValues = generateDefaultId(tableClass, originalElement)
  const variables = {
    ...createVariables(tableClass, originalElement, changes),
    ...idValues
  }
  const action = Object.keys(originalElement).length > 0 ? 'update' : 'insert'
  const idFields = tableClass.idColumnNames
  const formFieldNames = Object.keys(variables)
  const permittedEditFields = permittedFieldsOf(
    ability,
    action,
    tableClass.name
  ).filter(field => !idFields.includes(field) && formFieldNames.includes(field))
  const allFields = [...permittedEditFields, ...idFields]
  const variableProperties = tableClass.properties.filter(property =>
    allFields.includes(property.name)
  )

  const __variables = variableProperties.reduce<Record<string, string>>(
    (result, property) => {
      result[property.name] = graphQlType(property.type)
      if (
        idFields.includes(property.name) ||
        (action === 'insert' && property.required)
      )
        result[property.name] += '!' // Flag any primary key or (non nullable + no default) field as required
      return result
    },
    {}
  )
  // ! Update
  const __args = {
    _set: permittedEditFields.reduce<Record<string, VariableType>>(
      (result, name) => {
        result[name] = new VariableType(name)
        return result
      },
      {}
    ),
    where: {
      _and: idFields.map(name => ({ [name]: { _eq: new VariableType(name) } }))
    }
  }
  // ! End Update
  // TODO Insert equivalent of the above
  const returning = filteredJsonObject(
    tableClass,
    tableClass.jsonObjectElement,
    ability
  )

  const mutation = gql(
    jsonToGraphQLQuery(
      {
        mutation: {
          __variables,
          [`${action}_${tableClass.name}`]: {
            __args,
            returning
          }
        }
      },
      { pretty: true }
    )
  )

  const optimisticResult = { ...originalElement, ...newElement, ...idValues }
  const cachedListQuery = listQuery(tableClass, ability)
  apolloClient.mutate({
    mutation,
    variables,
    update: (cache, data) => {
      // Updates the cache with the optimistic response first, then with the value from the server
      // TODO update the relationships as well
      const savedItem = get<ObjectMap>(
        data,
        ['data', `${action}_${tableClass.name}`, 'returning', 0],
        {}
      )
      const cachedList = cache.readQuery<ObjectMap>({ query: cachedListQuery })
      if (cachedList) {
        const listCache = get<ObjectMap[]>(
          cachedList,
          [`${tableClass.name}_aggregate`, 'nodes'],
          []
        )
        // Checks if the item already is in the cache, based on its primary key fields
        const index = listCache.findIndex(item =>
          idFields.every(field => item[field] === savedItem[field])
        )
        if (index >= 0) {
          // Replace the item if found in the cache
          listCache.splice(index, 1, savedItem)
        } else {
          // Create the item in the list if it doesn't exist yet
          listCache.push(savedItem) // TODO sort
        }
        cache.writeQuery({ query: cachedListQuery, data: cachedList })
      }
    },
    optimisticResponse: {
      // ? What about client/server calculated fields?
      [`${action}_${tableClass.name}`]: {
        __typename: `${tableClass.name}_mutation_response`,
        returning: [optimisticResult] // TODO add generated fields
      }
    }
  })
  return optimisticResult
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
