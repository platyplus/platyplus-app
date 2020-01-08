import { useStore } from '../store'
import { useRouter } from '../router'

import { useLocale, useTranslator } from './i18n'
import { languageCode } from '../modules/i18n/helpers'
import { useQuasar } from '../modules/quasar'
import { computed } from '@vue/composition-api'

// ? move to authentication/composables?
export const useLogout = () => {
  const store = useStore()
  const router = useRouter()
  const locale = useLocale()
  const translate = useTranslator()
  const quasar = useQuasar()
  return () =>
    quasar
      .dialog({
        message: translate('logout.message'),
        cancel: true,
        persistent: true
      })
      .onOk(async () => {
        await store.dispatch('signout')
        locale.value = languageCode(navigator.language)
        router.replace('/public')
      })
}

export const useAuthenticated = () =>
  computed(() => useStore().getters['authentication/authenticated'])

export const useProfile = () =>
  computed(() => useStore().getters['authentication/profile'])
