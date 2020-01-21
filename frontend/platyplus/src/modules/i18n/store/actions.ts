import { ActionTree } from 'vuex'
import { I18nState } from './state'
import { getI18n } from '../instance'

export const actions: ActionTree<I18nState, {}> = {
  setLocale: {
    root: true,
    handler: ({ commit }, locale) => {
      getI18n().locale = locale
      // this.$i18n.setLocaleMessage(locale, messages)
      commit('set', locale)
    }
  }
}