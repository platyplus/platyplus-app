import { apolloClient } from '@platyplus/hasura-apollo-client'

import { TableQuery, MetadataQuery, Metadata } from './types/queries'
import tablesList from './graphql/tablesList.graphql'
import tableQuery from './graphql/table.graphql'
export const tableNamesList = (): Metadata[] => {
  try {
    const result = apolloClient.readQuery<MetadataQuery>({
      query: tablesList
    })
    return result?._metadata || []
  } catch {
    throw Error('Unable to fetch the metadata list from the cache')
  }
}

export const tableMetadata = (name?: string): Metadata => {
  try {
    const result = apolloClient.readQuery<TableQuery>({
      query: tableQuery,
      variables: { name }
    })
    if (result) return result._metadataTable
    else throw Error(`Metadata for ${name} not found from the cache`)
  } catch {
    throw Error(`Unable to fetch metadata for ${name} from the cache`)
  }
}

export const tablesMetadata = () =>
  tableNamesList().map(tableName => tableMetadata(tableName.name))
