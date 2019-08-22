import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query'
import gql from 'graphql-tag'
import { set } from 'object-path'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'

export interface PreGraphQl {
  [key: string]: boolean | PreGraphQl
}

export const preGraphQl = (tableClass: TableClass, ability: Ability) => {
  let result: PreGraphQl = {}
  const permittedFields = permittedFieldsOf(ability, 'select', tableClass.name)
  for (const columnName of permittedFields) {
    const property = tableClass.getColumnProperty(columnName)
    if (property) {
      result = Object.assign(result, property.preGraphQl)
      if (property.isReference) {
        for (const reference of property.references) {
          result = Object.assign(result, reference.preGraphQl)
        }
      }
    }
  }
  return { query: { [tableClass.name]: result } }
}

// TODO handle the case where there is no property
export const graphQlQuery = (tableClass: TableClass, ability: Ability) =>
  gql(jsonToGraphQLQuery(preGraphQl(tableClass, ability), { pretty: true }))

// TODO handle the case where there is no property
export const elementGraphQlQuery = (
  tableClass: TableClass,
  ability: Ability
) => {
  const baseQuery = preGraphQl(tableClass, ability)
  set(baseQuery, 'query.__variables', {
    id: 'uuid!'
  })
  set(baseQuery, `query.${tableClass.name}.__args`, {
    where: { id: { _eq: new VariableType('id') } }
  })
  return gql(jsonToGraphQLQuery(baseQuery, { pretty: true }))
}
