import { computed, onMounted, onUpdated } from '@vue/composition-api'

import { useStore } from '../store'
import { useQuasar } from '../../quasar'
// TODO get rid of the quasar dependency

export const useDrawer = () => {
  const store = useStore()
  const quasar = useQuasar()
  if (store.getters['navigation/drawer']) {
    store.dispatch('navigation/setDrawer', {
      value: quasar.platform.is.desktop
    })
  }
  return computed<boolean>({
    get: () => store.getters['navigation/drawer'],
    set: value => store.dispatch('navigation/setDrawer', { value })
  })
}

export function useToggleDrawer() {
  const store = useStore()
  return () => {
    store.dispatch('navigation/toggleDrawer')
  }
}

// ? crappy, not sure to make it so complicated with the composition api
// ? use a watcher instead? -> param title should be reactive
export const setTitle = (title: string) => {
  const store = useStore()
  onUpdated(() => {
    store.commit('navigation/setTitle', {
      label: title,
      translate: true
    })
  })
  onMounted(() => {
    store.commit('navigation/setTitle', {
      label: title,
      translate: true
    })
  })
}

export const useTitle = () => {
  const store = useStore()
  return computed<string>({
    get: () => store.getters['navigation/title'],
    set: title =>
      store.commit('navigation/setTitle', { label: title, translate: true })
  })
}
