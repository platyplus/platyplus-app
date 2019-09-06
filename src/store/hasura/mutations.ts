import { MutationTree } from 'vuex'

import Schema from 'src/hasura/schema/schema'
import { TableDefinition } from 'src/types/tables'

import { HasuraState } from './state'

export const mutations: MutationTree<HasuraState> = {
  initSchema(state, tables: TableDefinition[]) {
    state.schema = new Schema(tables)
  }
}
