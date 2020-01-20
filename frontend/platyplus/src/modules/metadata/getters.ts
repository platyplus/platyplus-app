import { TableQuery, MetadataQuery, Table } from './types'
import tablesList from './graphql/tablesList.graphql'
import tableQuery from './graphql/table.graphql'
import { getApolloClient } from '.'

export const tableNamesList = (): Table[] => {
  try {
    const result = getApolloClient().readQuery<MetadataQuery>({
      query: tablesList
    })
    return result?._metadata || []
  } catch {
    throw Error('Unable to fetch the metadata list from the cache')
  }
}

export const tableMetadata = (name?: string): Table => {
  try {
    const result = getApolloClient().readQuery<TableQuery>({
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
