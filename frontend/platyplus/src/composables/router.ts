import { computed } from '@vue/composition-api'
import { useRouter } from '../router'

export const useRouterQuery = () => {
  const router = useRouter()
  return computed(() => router.currentRoute.query)
}
