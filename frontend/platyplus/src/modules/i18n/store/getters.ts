import { GetterTree } from 'vuex'

import { I18nState } from './state'

export const getters: GetterTree<I18nState, {}> = {
  locale: state => state.locale
}
