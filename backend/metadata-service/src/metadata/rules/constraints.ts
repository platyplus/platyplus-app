import { Table } from '../tables'

export class Check {
  table: Table
  name: string
  check: string
}

export interface UniqueConstraint {
  name: string
  columns: string[]
}
