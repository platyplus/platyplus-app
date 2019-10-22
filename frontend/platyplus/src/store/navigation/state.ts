export interface NavigationState {
  routePath?: string
  drawer?: boolean
  title: { label: string; translate: boolean }
}

export const state: NavigationState = {
  routePath: undefined,
  drawer: false,
  title: { label: 'title', translate: true }
}
