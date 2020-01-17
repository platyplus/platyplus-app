import { MutationTree } from 'vuex'

import { I18nState } from './state'

export const mutations: MutationTree<I18nState> = {
  set(state, locale) {
    state.locale = locale
    localStorage.setItem('locale', locale)
  }
}
