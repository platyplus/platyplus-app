import { ObjectMap } from '../../common'
import { Table } from './objects'

export type WithTypeName = {
  __typename?: string
}

export type DataObject = ObjectMap & WithTypeName

export interface MetadataQuery {
  _metadata: Table[]
}
export interface TableQuery {
  _metadataTable: Table
}

export type ListObject = {
  aggregate: {
    max: {
      updated_at: string
      __typename: string
    }
  }
  nodes: DataObject[]
  __typename: string
}

export type ListResult = {
  result: ListObject
}

export type ElementResult = {
  result: DataObject
}
