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
    // TODO: use prefetch, but then gather all profile routes to 'children' routes and all
    // 'transactionnal' routes in 'children' routes so we can put this piece of code below
    // in a shared prefetch method
    if (store().getters['authentication/status'].loggedIn) {
      let user = store().getters['authentication/user']
      if (!user.preferred_org_unit && !to.meta.withoutPreferredOrgUnit) {
        store().dispatch('navigation/routeRequest', { path: to.path })
        next('/profile/current-org-unit')
      } else next()
    } else next()
  })
  return Router
}
