import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { QuasarBootOptions } from 'src/types/quasar'

export const locales = [
  { label: '🇬🇧', value: 'en' },
  { label: '🇫🇷', value: 'fr' }
]

// TODO use Vuex, and link the user locale somehow
export default ({ app, Vue }: QuasarBootOptions) => {
  Vue.use(VueI18n)
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: navigator.language.substring(0, 2),
    sync: true,
    fallbackLocale: 'en',
    messages // TODO: only load the messages of the desired language?
  })

  Object.defineProperty(Vue.prototype, '$locale', {
    get: function() {
      return this.$i18n.locale
    },
    set: function(locale) {
      this.$i18n.locale = locale
      // dynamic import, so loading on demand only
      import(`quasar/lang/${locale}`).then(({ default: messages }) => {
        this.$q.lang.set(messages)
      })
      // this.$i18n.setLocaleMessage(locale, messages)
    }
  })
  Vue.prototype.$locales = locales
}

declare module 'vue/types/vue' {
  interface Vue {
    i18n?: VueI18n
  }
}
