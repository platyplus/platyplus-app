import { computed } from '@vue/composition-api'
import { useStore } from '../modules/common'

export const useLoading = () =>
  computed(() => useStore().getters['loading/loading'])
