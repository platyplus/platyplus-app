import { ActionTree } from 'vuex'
import { I18nState } from './state'
import { i18n } from '..'

export const actions: ActionTree<I18nState, {}> = {
  setLocale: {
    root: true,
    handler: ({ commit }, locale) => {
      i18n.locale = locale
      // this.$i18n.setLocaleMessage(locale, messages)
      commit('set', locale)
    }
  }
}
