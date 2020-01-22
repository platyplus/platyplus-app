import { computed } from '@vue/composition-api'
import { useStore } from '../store'

export const useLoading = () => {
  const store = useStore()
  return computed(() => store.getters['loading/loading'])
}
