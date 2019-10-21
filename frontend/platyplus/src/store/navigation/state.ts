export interface NavigationState {
  routePath?: string
  drawer?: boolean
  title: string
}

export const state: NavigationState = {
  routePath: undefined,
  drawer: false,
  title: 'title'
}
