import _Vue from 'vue'
import VueI18n, { I18nOptions as _I18nOptions, Locale } from 'vue-i18n'
import { Store } from 'vuex'
import { i18nModule } from './module'
import { provide, inject } from '@vue/composition-api'

// TODO split the following const into 1. all the possible locales, and 2. the locales used by the application
export const locales = [
  { label: '🇬🇧', value: 'en-us' },
  { label: '🇫🇷', value: 'fr' }
]

export interface I18nOptions extends _I18nOptions {
  app: _Vue
  store: Store<{}>
}

export let i18n: VueI18n

export function I18nPlugin(Vue: typeof _Vue, options: I18nOptions) {
  const { app, store, ...i18nOptions } = options

  Vue.use(VueI18n)
  store.registerModule('i18n', i18nModule)

  const defaultOptions = {
    // locale: store.getters['i18n/locale'],
    sync: true,
    fallbackLocale: 'en-us'
  }
  i18n = new VueI18n({
    ...defaultOptions,
    ...i18nOptions
  })
  app.i18n = i18n

  Object.defineProperty(Vue.prototype, '$locale', {
    get: function() {
      return this.$store.getters['i18n/locale']
    },
    set: function(locale) {
      this.$store.dispatch('setLocale', locale)
    }
  })
  Vue.prototype.$locales = locales

  store.dispatch('setLocale', store.getters['i18n/locale'])
}

declare module 'vue/types/vue' {
  interface Vue {
    i18n: VueI18n
    $locale: Locale
    $locales: Locale[]
  }
}

const I18nSymbol = Symbol()

export function provideI18n() {
  provide(I18nSymbol, i18n)
}

export function useI18n() {
  const i18n = inject(I18nSymbol)
  if (!i18n) {
    // throw error, no store provided
  }
  return i18n as VueI18n
}
