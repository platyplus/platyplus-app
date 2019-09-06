import { Route } from 'vue-router'
import { Mixins } from 'vue-property-decorator'

import { RouterMixin } from 'src/mixins'
import { QuasarBootOptions } from 'src/types/quasar'

export default ({ Vue, store, router }: QuasarBootOptions) => {
  /**
   * * Creates a pointer to the vue router available from the Vuex store
   * It is required for the Vuex routing actions
   */
  store.commit('navigation/linkRouter', router)
  Vue.mixin(Mixins(RouterMixin))

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
        store.dispatch('navigation/routeRequest', { path: to.fullPath })
        return next('/public/auth/signin')
      }
    } else {
      const user = store.getters['user/profile']
      if (
        !user.preferred_org_unit &&
        !to.matched.some(route => route.meta.withoutPreferredOrgUnit)
      ) {
        // TODO weird error: when loading app.localhost/data/org_unit/edit with no preferred org_unit
        store.dispatch('navigation/routeRequest', { path: to.fullPath })
        return next('/profile/current-org-unit')
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
