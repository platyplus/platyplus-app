import { computed } from '@vue/composition-api'
import { useStore } from '../store'

export const useLoading = () =>
  computed(() => useStore().getters['loading/loading'])
