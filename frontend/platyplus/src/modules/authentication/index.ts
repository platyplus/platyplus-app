import Vue from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { userModule } from './store'
import { ApolloClient } from '@platyplus/hasura-apollo-client'

export * from './composables'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultApolloClient = ApolloClient<any>

let _apolloClient: DefaultApolloClient
export const getApolloClient = () => _apolloClient

export interface AuthenticationOptions {
  router: VueRouter
  store: Store<{}>
  apolloClient: DefaultApolloClient
  publicPath?: string
  authPath?: string
  loginPath?: string
}

const defaultOptions: Partial<AuthenticationOptions> = {
  publicPath: '/public',
  authPath: '/profile/current-org-unit',
  loginPath: '/public/auth/signin'
}

export const AuthenticationPlugin = async (
  _Vue: typeof Vue,
  options: AuthenticationOptions
) => {
  const { store, router, apolloClient, publicPath, authPath, loginPath } = {
    ...defaultOptions,
    ...options
  }
  _apolloClient = apolloClient
  store.registerModule('authentication', userModule)

  /**
   * * Main navigation guard.
   * If not authenticated:
   * - Redirects '/' to '/public'
   * - Only allows child routes of the '/public' route.
   * - If another route is requested, store the requested route to the Vuex store and redirect to the authentication page.
   * If authenticated:
   * - If no preferred org unit exists, redirects to the page to select it
   * - Routes otherwise
   */
  router.beforeEach(async (to, from, next) => {
    if (!store.getters['authentication/authenticated']) {
      if (to.path === '/') return next(publicPath)
      const publicRoute = to.matched.some(route => {
        return route.path === publicPath
      })
      if (!publicRoute) {
        store.dispatch('navigation/routeRequest', { path: to.fullPath })
        return next(loginPath)
      }
    } else {
      const user = store.getters['authentication/profile']
      if (!user.id)
        console.warn(
          'Non existing user (no id) while the authentication/unauthenticated return true!!!'
        ) // * weird error
      if (
        !user.preferred_org_unit &&
        !to.matched.some(route => route.meta.withoutPreferredOrgUnit)
      ) {
        // ? weird error: when loading app.localhost/data/org_unit/edit with no preferred org_unit
        store.dispatch('navigation/routeRequest', { path: to.fullPath })
        return next(authPath)
      }
    }
    return next()
  })

  if (store.getters['authentication/authenticated'])
    await store.dispatch('onAuthenticated')
}
