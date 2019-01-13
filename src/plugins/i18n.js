import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

export default ({ app, Vue, store }) => {
  Vue.use(VueI18n)
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'en-uk',
    sync: true,
    fallbackLocale: 'en-uk',
    messages // TODO: only load the messages of the desired language?
  })
  Vue.mixin({
    computed: {
      $locale: {
        get () {
          return this.$i18n.locale
        },
        async set (lang) {
          // dynamic import, so loading on demand only
          const language = await import(`quasar-framework/i18n/${lang}`)
          this.$q.i18n.set(language.default)
          const messages = await import(`../i18n/${lang}`)
          this.$i18n.locale = lang
          this.$i18n.setLocaleMessage(lang, messages.default)
        }
      },
      $locales () {
        return locales
      }
    }
  })
}

export const locales = [
  { label: '🇬🇧', value: 'en-uk' },
  { label: '🇫🇷', value: 'fr' }
]
