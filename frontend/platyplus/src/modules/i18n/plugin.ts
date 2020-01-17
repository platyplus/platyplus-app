import _Vue from 'vue'
import VueI18n, { I18nOptions as _I18nOptions } from 'vue-i18n'
import { Store } from 'vuex'
import { i18nModule } from './store'
import { setI18n, getI18n } from './instance'

export interface I18nOptions extends _I18nOptions {
  app: _Vue
  store: Store<{}>
}

export function I18nPlugin(Vue: typeof _Vue, options: I18nOptions) {
  const { app, store, ...i18nOptions } = options

  Vue.use(VueI18n)
  store.registerModule('i18n', i18nModule)

  const defaultOptions = {
    // locale: store.getters['i18n/locale'],
    sync: true,
    fallbackLocale: 'en-us'
  }
  setI18n(
    new VueI18n({
      ...defaultOptions,
      ...i18nOptions
    })
  )
  app.i18n = getI18n()

  store.dispatch('setLocale', store.getters['i18n/locale'])
}

declare module 'vue/types/vue' {
  interface Vue {
    i18n: VueI18n
  }
}
