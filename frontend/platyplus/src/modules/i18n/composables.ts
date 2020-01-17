import { provide, inject, computed } from '@vue/composition-api'
import VueI18n, { Values } from 'vue-i18n'
import { useStore } from '../common/store'
import { getI18n } from './instance'

const I18nSymbol = Symbol()

export function provideI18n() {
  provide(I18nSymbol, getI18n())
}

export function useI18n() {
  const i18n = inject(I18nSymbol)
  if (!i18n) {
    // throw error, no store provided
  }
  return i18n as VueI18n
}

export const useTranslator = () => {
  const i18n = useI18n()
  return (path: string, values?: Values) => i18n.t(path, values) as string
}

export const useLocale = () => {
  const store = useStore()
  return computed<string>({
    get: () => store.getters['i18n/locale'],
    set: locale => store.dispatch('setLocale', locale)
  })
}
