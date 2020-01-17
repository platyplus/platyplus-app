import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { RootState } from '../common'

export interface QuasarBootOptions {
  app: Vue
  Vue: VueConstructor
  router: VueRouter
  store: Store<RootState>
}
