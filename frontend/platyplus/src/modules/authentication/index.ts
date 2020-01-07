import _Vue from 'vue'
import { Store, mapGetters } from 'vuex'
import VueRouter from 'vue-router'

import { userModule } from './module'
import { User } from './types'

export interface UserOptions {
  store: Store<{}>
  router: VueRouter
  app: _Vue
  publicPath?: string
  authPath?: string
  loginPath?: string
}

const defaultOptions: Partial<UserOptions> = {
  publicPath: '/public',
  authPath: '/profile/current-org-unit',
  loginPath: '/public/auth/signin'
}

export function AuthenticationPlugin(Vue: typeof _Vue, options: UserOptions) {
  const { store, router, publicPath, authPath, loginPath } = {
    ...defaultOptions,
    ...options
  }
  store.registerModule('authentication', userModule)

  Vue.mixin({
    // * https://vuex.vuejs.org/guide/getters.html#the-mapgetters-helper
    computed: {
      ...mapGetters({
        $profile: 'authentication/profile',
        $authenticated: 'authentication/authenticated'
      })
    }
  })

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
}

declare module 'vue/types/vue' {
  interface Vue {
    $profile: User
    $authenticated: boolean
  }
}
