import Vue from 'vue'
import Component from 'vue-class-component'
import { Route } from 'vue-router'

import { navigationModule } from './store'
import { QuasarBootOptions } from 'src/types/quasar'

Component.registerHooks(['beforeRouteEnter'])

/**
 * * Exposes the previous route to any component through the $from property
 */

@Component
class RouterMixin extends Vue {
  public $from = undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteEnter(to: Route, from: Route, next: any) {
    next((vm: Vue) => {
      vm.$from = from
    })
  }
}

export default ({ Vue, store, router }: QuasarBootOptions) => {
  store.registerModule('navigation', navigationModule)
  /**
   * * Creates a pointer to the vue router available from the Vuex store
   * It is required for the Vuex routing actions
   */
  store.commit('navigation/linkRouter', router)
  Vue.mixin(RouterMixin)

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
    if (!store.getters['user/authenticated']) {
      if (to.path === '/') return next('/public')
      const publicRoute = to.matched.some(route => {
        return route.path === '/public'
      })
      if (!publicRoute) {
        store.dispatch('navigation/routeRequest', { path: to.path })
        return next('/public/auth/signin')
      }
    } else {
      const user = store.getters['user/profile']
      if (
        !user.preferred_org_unit &&
        !to.matched.some(route => route.meta.withoutPreferredOrgUnit)
      ) {
        store.dispatch('navigation/routeRequest', { path: to.path })
        next('/profile/current-org-unit')
      }
    }
    return next()
  })
}

declare module 'vue/types/vue' {
  interface Vue {
    $from?: Route
  }
}
