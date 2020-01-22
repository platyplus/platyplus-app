import runner, { RunnerOption } from 'node-pg-migrate'
import { DATABASE_URL, METADATA_SCHEMA } from './config'

const options = {
  databaseUrl: DATABASE_URL,
  schema: METADATA_SCHEMA,
  createSchema: true,
  createMigrationsSchema: true,
  dir: __dirname + '/migrations',
  direction: 'up',
  migrationsSchema: METADATA_SCHEMA,
  migrationsTable: 'migrations'
} as RunnerOption

export default async () => {
  // ? Materialised view that refreshes at every hasura metadata update.
  await runner(options)
}
