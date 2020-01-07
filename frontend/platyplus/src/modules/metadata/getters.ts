import { apolloClient } from '@platyplus/hasura-apollo-client'

import { TableQuery, MetadataQuery } from './types/queries'
import { Table } from './types/objects'
import tablesList from './graphql/tablesList.graphql'
import tableQuery from './graphql/table.graphql'
export const tableNamesList = (): Partial<Table>[] => {
  try {
    const result = apolloClient.readQuery<MetadataQuery>({
      query: tablesList
    })
    return result?._metadata || []
  } catch {
    throw Error('Unable to fetch the metadata list from the cache')
  }
}

export const tableMetadata = (
  table?: string,
  schema = 'public'
): Partial<Table> => {
  try {
    const result = apolloClient.readQuery<TableQuery>({
      query: tableQuery,
      variables: { id: `${schema}.${table}` }
    })
    if (result) return result._metadataTable
    else throw Error(`Metadata for ${schema}.${table} not found from the cache`)
  } catch {
    throw Error(
      `Unable to fetch metadata for ${schema}.${table} from the cache`
    )
  }
}

export const tablesMetadata = () =>
  tableNamesList().map(tableName =>
    tableMetadata(tableName.name, tableName.schema)
  )
