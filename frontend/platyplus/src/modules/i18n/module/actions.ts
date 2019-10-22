import { ActionTree } from 'vuex'
import { I18nState } from './state'
import { languageCode } from '../helpers'

export const actions: ActionTree<I18nState, {}> = {
  setLocale: {
    root: true,
    handler: ({ commit }, locale) => {
      commit('set', locale)
    }
  },
  signout: {
    root: true,
    handler: async ({ commit }) => {
      commit('set', languageCode(navigator.language))
    }
  }
}
