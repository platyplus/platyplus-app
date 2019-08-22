import VueRouter from 'vue-router'

export interface NavigationState {
  routePath?: string
  drawer?: boolean
  router: VueRouter
}

export const state: NavigationState = {
  routePath: undefined,
  drawer: false,
  router: ({} as unknown) as VueRouter
}
