import { Context } from 'koa'
import { Resolver, Query, Ctx, Arg } from 'type-graphql'
import { loadRawMetadata } from './data-loader'
import { Table } from './schema/table'
import { getRole } from './config'

@Resolver(of => Table)
export class TableResolver {
  @Query(returns => [Table], { description: 'Get the metadata' })
  async _metadata(
    @Ctx() context: Context,
    @Arg('schema', { nullable: true }) schema?: string,
    @Arg('table', { nullable: true }) table?: string
  ): Promise<Table[]> {
    const role = getRole(context)
    let tables = await loadRawMetadata()
    if (schema) tables = tables.filter(cursor => cursor.schema === schema)
    if (table) tables = tables.filter(cursor => cursor.name === table)
    tables = tables.filter(cursor =>
      cursor.permissions.find(permission => permission.role === role)
    )
    return tables
  }
  @Query(returns => Table, {
    nullable: true,
    description: 'Get the metadata of one single table, per ID'
  })
  async _metadataTable(
    @Ctx() context: Context,
    @Arg('id') id: string
  ): Promise<Table> {
    const [schema, table] = id.split('.')
    return (await this._metadata(context, schema, table))[0]
  }
}
