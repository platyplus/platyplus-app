import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './app/initialRoutes'
import { initRouter } from './modules/common'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
export default (/* { store, ssrContext } */) =>
  initRouter({
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes,
    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
