import { Locale } from 'vue-i18n'
import { languageCode } from '../helpers'

export interface I18nState {
  locale: Locale
}

export const state: I18nState = {
  locale: localStorage.getItem('locale') || languageCode(navigator.language)
}
