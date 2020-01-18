import VueI18n, { I18nOptions } from 'vue-i18n'

let i18n: VueI18n
const defaultOptions = {
  // locale: store.getters['i18n/locale'],
  sync: true,
  fallbackLocale: 'en-us'
}

export const initI18n = (options: I18nOptions) => {
  i18n = new VueI18n({
    ...defaultOptions,
    ...options
  })
  return i18n
}
export const getI18n = () => i18n
