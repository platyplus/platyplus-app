import { sql, createPool } from 'slonik'

import { DATABASE_URL, DATABASE_SCHEMA } from './config'
import { Table, RawTable } from './schema/table'

export let tables: Table[] = []

let lastLoad = new Date(0)
export const loadRawMetadata = async () => {
  const pool = createPool(DATABASE_URL)
  const {
    rows: [{ occurred }]
  } = await pool.query(
    sql`SELECT occurred_at as occurred from hdb_catalog.hdb_schema_update_event`
  )
  const lastUpdate = new Date(occurred)
  if (lastLoad < lastUpdate) {
    console.log('fetching metadata from the database...')
    lastLoad = new Date()
    // TODO implement GraphQL field names
    const { rows } = await pool.query<RawTable>(
      sql`SELECT * from ${sql.identifier([DATABASE_SCHEMA, 'metadata'])}`
    )
    await pool.end()
    console.log('metadata fetching done.')
    tables = rows.map(row => new Table(row))
    console.log('metadata loaded.')
  }
  return tables
}
