import Vue from 'vue'
import VueI18n, { I18nOptions as _I18nOptions } from 'vue-i18n'
import { Store } from 'vuex'
import { i18nModule } from './store'
import { initI18n } from './instance'
import { provide, inject } from '@vue/composition-api'

export interface I18nOptions extends _I18nOptions {
  store: Store<{}>
}

const I18nSymbol = Symbol()

export function provideI18n(options: I18nOptions) {
  const { store, ...i18nOptions } = options
  Vue.use(VueI18n)
  store.registerModule('i18n', i18nModule)
  provide(I18nSymbol, initI18n(i18nOptions))
  store.dispatch('setLocale', store.getters['i18n/locale'])
}

export function useI18n() {
  const i18n = inject(I18nSymbol)
  if (!i18n) {
    // throw error, no store provided
  }
  return i18n as VueI18n
}
