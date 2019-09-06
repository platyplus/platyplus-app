import { mapGetters } from 'vuex'
import { QuasarBootOptions } from 'src/types/quasar'
import { userModule, ability } from './store'
import { abilitiesPlugin } from '@casl/vue'
import { store } from 'src/store'

export const getEncodedToken = () => store.getters['user/encodedToken']

export default ({ Vue, store }: QuasarBootOptions) => {
  store.registerModule('user', userModule)
  Vue.use(abilitiesPlugin, ability)
  Vue.mixin({
    // * https://vuex.vuejs.org/guide/getters.html#the-mapgetters-helper
    computed: mapGetters({
      $authenticated: 'user/authenticated',
      $profile: 'user/profile',
      $token: 'user/token',
      $title: 'navigation/title'
    })
  })
}
