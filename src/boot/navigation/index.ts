import Vue from 'vue'
import Component from 'vue-class-component'
import { Route } from 'vue-router'
import { ability } from 'src/boot/user/store' // TODO acces through a vuex getter?

import { navigationModule } from './store'
import { QuasarBootOptions } from 'src/types/quasar'

Component.registerHooks(['beforeRouteEnter'])

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
  store.commit('navigation/linkRouter', router) // Creates a pointer to the vue router available from the Vuex store
  Vue.mixin(RouterMixin)

  router.beforeEach(async (to, from, next) => {
    // TODO recuperer l'id et le type de l'objet, et vérifier d'ability
    // TODO put into a beforeEnter in the created hasura routes
    const canNavigate = to.matched.some(route => {
      return ability.can(route.meta.action || 'read', {
        $type: route.meta.resource || 'org_unit' // TODO
      })
    })
    if (!store.getters['user/authenticated']) {
      if (to.path === '/') return next('/public')
      if (!canNavigate) {
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
    if (!canNavigate) {
      // TODO completer les routes puis activer
      console.log('Forbidden')
      //   return next('/')
    }
    console.log('succeed: ' + to.path)
    return next()
  })
}

declare module 'vue/types/vue' {
  interface Vue {
    $from?: Route
  }
}
