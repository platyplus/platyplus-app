import { ObjectMap } from '../../../types/common'
import { Table } from './objects'

export interface MetadataQuery {
  _metadata: Partial<Table>[]
}
export interface TableQuery {
  _metadataTable: Partial<Table>
}

export type Node = ObjectMap & {
  __typename: string
}
export type Result = {
  aggregate: {
    max: {
      updated_at: string
      __typename: string
    }
  }
  nodes: Node[]
  __typename: string
}
export type Data = {
  result: Result
}
