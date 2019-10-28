import { ActionTree } from 'vuex'
import { I18nState } from './state'

export const actions: ActionTree<I18nState, {}> = {
  setLocale: {
    root: true,
    handler: ({ commit }, locale) => {
      commit('set', locale)
    }
  }
}
