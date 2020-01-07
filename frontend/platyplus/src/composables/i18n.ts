import { useI18n } from '../modules/i18n'

export const useTranslator = () => {
  const i18n = useI18n()
  return (path: string) => i18n.t(path) as string
}

import { computed } from '@vue/composition-api'
import { useStore } from '../store'

export const useLocale = () => {
  const store = useStore()
  return computed<string>({
    get: () => store.getters['i18n/locale'],
    set: locale => store.dispatch('setLocale', locale)
  })
}
