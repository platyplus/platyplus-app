import VueRouter, { RouterOptions } from 'vue-router'

import { getRouter, setRouter } from './instance'

export * from './instance'
export * from './composables'

export const initRouter = (options: RouterOptions) => {
  setRouter(new VueRouter(options))
  return getRouter()
}
