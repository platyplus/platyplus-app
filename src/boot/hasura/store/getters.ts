import { GetterTree } from 'vuex'
import { HasuraState } from './state'
import { RootState } from 'src/store'

export const getters: GetterTree<HasuraState, RootState> = {
  schema(state) {
    return state.schema
  },
  class: state => (name: string) => state.schema.getClass(name)
}
