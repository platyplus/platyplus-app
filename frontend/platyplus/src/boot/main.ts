import Vue, { VueConstructor } from 'vue'
import VueCompositionApi from '@vue/composition-api'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import { createClient } from '@platyplus/hasura-apollo-client'

import HeaderBar from '../components/header-bar.vue'
import MenuItem from '../components/menu-item.vue'

import { AuthenticationPlugin } from '../modules/authentication'
import { QuasarMetadataPlugin } from '../modules/metadata-quasar'
import { getConfig } from '../modules/common'

import PageLayout from '../layouts/Page.vue'
import UserLayout from '../layouts/user/Layout.vue'
import UserHeader from '../layouts/user/Header.vue'
import UserMenu from '../layouts/user/Menu.vue'
import introspectionQueryResultData from '../modules/metadata/fragmentTypes.json'

interface QuasarBootOptions {
  app: Vue
  Vue: VueConstructor
  router: VueRouter
  store: Store<{}>
}

export default async ({ Vue, router, store }: QuasarBootOptions) => {
  const apolloClient = createClient({
    uri: getConfig().API,
    getToken: () => store.getters['authentication/encodedToken'],
    introspectionQueryResultData
  })
  Vue.use(VueCompositionApi)
  Vue.use(QuasarMetadataPlugin, {
    store,
    router,
    apolloClient,
    mainLayout: { component: UserLayout },
    pageLayout: {
      components: {
        default: PageLayout,
        header: UserHeader,
        menu: UserMenu
      }
    }
  })
  Vue.use(AuthenticationPlugin, { router, store, apolloClient })

  // ? only load the messages of the desired language?
  Vue.component('h-header-bar', HeaderBar)
  Vue.component('h-menu-item', MenuItem)

  // TODO put in provideValidation, part of a validation module
  // configure({
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   defaultMessage: (field: string, values: any) => {
  //     // override the field name.
  //     values._field_ = `"${app.i18n.t(field)}"`
  //     return app.i18n.t(`validation.${values._rule_}`, values) as string
  //   }
  // })
  Vue.component('ValidationObserver', ValidationObserver) // ? Put in a distinct module?
  Vue.component('ValidationProvider', ValidationProvider) // ? Put in a distinct module?
}
