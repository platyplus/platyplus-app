import { Store, mapGetters } from 'vuex'
import { RootState } from 'src/store'
import { QuasarBootOptions } from 'src/types/quasar'
import { userModule, ability } from './store'
import { abilitiesPlugin } from '@casl/vue'

let currentStore: Store<RootState>

export const getEncodedToken = () => currentStore.getters['user/encodedToken']

export default ({ Vue, store }: QuasarBootOptions) => {
  currentStore = store
  store.registerModule('user', userModule)
  Vue.use(abilitiesPlugin, ability)
  Vue.mixin({
    // * https://vuex.vuejs.org/guide/getters.html#the-mapgetters-helper
    computed: mapGetters({
      $authenticated: 'user/authenticated',
      $profile: 'user/profile',
      $token: 'user/token'
    })
  })
}
