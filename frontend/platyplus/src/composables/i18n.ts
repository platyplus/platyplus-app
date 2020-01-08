import { computed } from '@vue/composition-api'
import { Values } from 'vue-i18n'
import { useI18n } from '../modules/i18n'
import { useStore } from '../store'

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
