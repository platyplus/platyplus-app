import _Vue from 'vue'
import VueI18n, { I18nOptions } from 'vue-i18n'

/**
 * * Returns the simplified language code that is supported by Quasar and the application
 * E.g. Quasar uses 'en-us' but not 'en', and uses 'fr' but not 'fr-fr'
 * @param code the ISO language code e.g. fr-be, en, en-US
 */
const languageCode = (code: string) => {
  code = code.toLocaleLowerCase()
  if (code.startsWith('en')) return 'en-us'
  if (code.startsWith('fr')) return 'fr'
  return code
}
// TODO split the following const into 1. all the possible locales, and 2. the locales used by the application
export const locales = [
  { label: '🇬🇧', value: 'en-us' },
  { label: '🇫🇷', value: 'fr' }
]

export function I18nPlugin(
  Vue: typeof _Vue,
  app: _Vue,
  options: I18nOptions = {}
) {
  Vue.use(VueI18n)

  Object.defineProperty(Vue.prototype, '$locale', {
    get: function() {
      return this.$i18n.locale
    },
    set: function(locale) {
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
  const defaultOptions = {
    locale: languageCode(navigator.language),
    sync: true,
    fallbackLocale: 'en-us'
  }
  app.i18n = new VueI18n({ ...defaultOptions, ...options })
}

declare module 'vue/types/vue' {
  interface Vue {
    i18n: VueI18n
  }
}
