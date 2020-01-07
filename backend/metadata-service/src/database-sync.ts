import runner, { RunnerOption } from 'node-pg-migrate'
import { DATABASE_URL, DATABASE_SCHEMA } from './config'

const options: RunnerOption = {
  databaseUrl: DATABASE_URL,
  schema: DATABASE_SCHEMA,
  createSchema: true,
  createMigrationsSchema: true,
  dir: __dirname + '/migrations',
  direction: 'up',
  migrationsSchema: DATABASE_SCHEMA,
  migrationsTable: 'migrations',
  count: -1
}

export default async () => {
  // ? Materialised view that refreshes at every hasura metadata update.
  await runner(options)
}
