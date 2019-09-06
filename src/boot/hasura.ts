import { QVueGlobals } from 'quasar'
import VueApollo from 'vue-apollo'
import { Mixins } from 'vue-property-decorator'

import { apolloProvider } from 'src/hasura/apollo'
import { ApolloMixin } from 'src/mixins'
import { QuasarBootOptions } from 'src/types/quasar'

import MenuItem from 'components/MenuItem.vue'
import Input from 'components/Input.vue'

export default ({ Vue, app }: QuasarBootOptions) => {
  Vue.use(VueApollo)
  Vue.mixin(Mixins(ApolloMixin))
  app.apolloProvider = apolloProvider

  Vue.component('p-input', Input)
  Vue.component('p-menu-item', MenuItem)
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider?: VueApollo
    $q: QVueGlobals
  }
}
