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
    @Arg('name', { nullable: true }) name?: string
  ): Promise<Table[]> {
    const role = getRole(context)
    let tables = await loadRawMetadata()
    if (name) tables = tables.filter(cursor => cursor.name === name)
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
    @Arg('name') name: string
  ): Promise<Table> {
    return (await this._metadata(context, name))[0]
  }
}
