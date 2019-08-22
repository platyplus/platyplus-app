import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query'
import gql from 'graphql-tag'
import { set } from 'object-path'
import { TableClass } from '../schema'

export interface PreGraphQl {
  [key: string]: boolean | PreGraphQl
}

export const preGraphQl = (tableClass: TableClass) => {
  let result: PreGraphQl = {}
  for (const property of tableClass.properties) {
    result = Object.assign(result, property.preGraphQl)
  }
  return { query: { [tableClass.name]: result } }
}

export const graphQlQuery = (tableClass: TableClass) =>
  gql(jsonToGraphQLQuery(preGraphQl(tableClass), { pretty: true }))

export const elementGraphQlQuery = (tableClass: TableClass) => {
  const baseQuery = preGraphQl(tableClass)
  set(baseQuery, 'query.__variables', {
    id: 'uuid!'
  })
  set(baseQuery, `query.${tableClass.name}.__args`, {
    where: { id: { _eq: new VariableType('id') } }
  })
  return gql(jsonToGraphQLQuery(baseQuery, { pretty: true }))
}
