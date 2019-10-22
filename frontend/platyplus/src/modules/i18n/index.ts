import _Vue from 'vue'
import VueI18n, { I18nOptions as _I18nOptions, Locale } from 'vue-i18n'
import { Store } from 'vuex'
import { i18nModule } from './module'

// TODO split the following const into 1. all the possible locales, and 2. the locales used by the application
export const locales = [
  { label: '🇬🇧', value: 'en-us' },
  { label: '🇫🇷', value: 'fr' }
]

export interface I18nOptions extends _I18nOptions {
  app: _Vue
  store: Store<{}>
}

export function I18nPlugin(Vue: typeof _Vue, options: I18nOptions) {
  const { app, store, ...i18nOptions } = options

  Vue.use(VueI18n)
  store.registerModule('i18n', i18nModule)

  const defaultOptions = {
    locale: store.getters['i18n/locale'],
    sync: true,
    fallbackLocale: 'en-us'
  }
  app.i18n = new VueI18n({
    ...defaultOptions,
    ...i18nOptions
  })

  Object.defineProperty(Vue.prototype, '$locale', {
    get: function() {
      return this.$store.getters['i18n/locale']
    },
    set: function(locale) {
      this.$store.dispatch('setLocale', locale)
      this.$i18n.locale = locale
      if (this.$q) {
        // dynamic import, so loading on demand only
        import(`quasar/lang/${locale}`).then(({ default: messages }) => {
          this.$q.lang.set(messages)
        })
      }
      // this.$i18n.setLocaleMessage(locale, messages)
    }
  })
  Vue.prototype.$locales = locales
}

declare module 'vue/types/vue' {
  interface Vue {
    i18n: VueI18n
    $locale: Locale
    $locales: Locale[]
  }
}
