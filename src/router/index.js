import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import store from '../store'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Router.beforeEach((to, from, next) => {
    if (store().state.authentication.status.loggedIn) {
      let user = store().getters['authentication/user']
      if (!user.preferred_org_unit && !to.meta.withoutPreferredOrgUnit) {
        store().dispatch('navigation/routeRequest', { path: to.path })
        next('/profile/current-org-unit')
      } else {
        next()
      }
    } else {
      if (to.path === '/') {
        next('/public')
      } else if (!to.meta.public) {
        store().dispatch('navigation/routeRequest', { path: to.path })
        next('/auth/signin')
      } else {
        next()
      }
    }
  })
  return Router
}
