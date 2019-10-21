import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

export let router: VueRouter

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
export default (/* { store, ssrContext } */) => {
  router = new VueRouter({
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes,
    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  return router
}
