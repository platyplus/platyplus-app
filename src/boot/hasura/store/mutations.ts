import { MutationTree } from 'vuex'
import { HasuraState } from './state'
import Schema from 'src/boot/hasura/schema/schema'
import { TableDefinition } from '../schema/tables-definition'

export const mutations: MutationTree<HasuraState> = {
  initSchema(state, tables: TableDefinition[]) {
    state.schema = new Schema(tables)
  }
}
