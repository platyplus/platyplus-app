import { GetterTree } from 'vuex'
import { NavigationState } from './state'
import { RootState } from 'src/store'

export const getters: GetterTree<NavigationState, RootState> = {
  drawer(state) {
    return state.drawer
  }
}
