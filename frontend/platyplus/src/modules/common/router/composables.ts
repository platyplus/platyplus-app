import VueRouter from 'vue-router'
import { provide, inject, reactive, computed } from '@vue/composition-api'
import { getRouter } from './instance'

const RouterSymbol = Symbol()

export function provideRouter() {
  provide(RouterSymbol, reactive(getRouter()))
}

export function useRouter() {
  const router = inject(RouterSymbol)
  if (!router) {
    // throw error, no store provided
  }
  return router as VueRouter
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteQuery = any // TODO

export const useRouteQuery = (router: VueRouter) =>
  computed(() => router.currentRoute.query)
