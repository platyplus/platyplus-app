import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

export default ({ app, Vue, store }) => {
  Vue.use(VueI18n)
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'en-us',
    sync: true,
    fallbackLocale: 'en-us',
    messages // TODO: only load the messages of the desired language?
  })

  Object.defineProperty(Vue.prototype, '$locale', {
    get: function () {
      return this.$i18n.locale
    },
    set: function (locale) {
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

export const locales = [
  { label: '🇬🇧', value: 'en-us' },
  { label: '🇫🇷', value: 'fr' }
]
