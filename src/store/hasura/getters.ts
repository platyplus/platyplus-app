import { GetterTree } from 'vuex'

import { RootState } from '..'
import { HasuraState } from './state'

export const getters: GetterTree<HasuraState, RootState> = {
  schema(state) {
    return state.schema
  },
  class: state => (name: string) => state.schema.getClass(name)
}
