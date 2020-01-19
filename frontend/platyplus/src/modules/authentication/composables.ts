import { computed } from '@vue/composition-api'

import { useStore, useRouter } from '../common'
import { useLocale, useTranslator, languageCode } from '../i18n'
import { useQuasar } from '../quasar'
// TODO get rid of the quasar dependency
// ? and of the i18n dependency?
import { User } from './types'

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

export const useAuthenticated = () => {
  const store = useStore()
  return computed(
    () => store.getters['authentication/authenticated'] as boolean
  )
}

export const useProfile = () => {
  const store = useStore()
  return computed(
    () => store.getters['authentication/profile'] as User | undefined
  )
}
