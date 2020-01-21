import { Route } from 'vue-router'
export interface NavigationState {
  routePath?: string
  from?: Route
  drawer?: boolean
  title: { label: string; translate: boolean }
}

export const state: NavigationState = {
  routePath: undefined,
  from: undefined,
  drawer: false,
  title: { label: 'title', translate: true }
}
