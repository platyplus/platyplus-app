import { computed } from '@vue/composition-api'
import VueRouter from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteQuery = any // TODO

export const useRouteQuery = (router: VueRouter) =>
  computed(() => router.currentRoute.query)
