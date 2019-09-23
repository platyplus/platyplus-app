import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { RootState } from 'src/store'

export interface QuasarBootOptions {
  app: Vue
  Vue: VueConstructor
  router: VueRouter
  store: Store<RootState>
}
