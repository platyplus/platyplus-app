import { abilitiesPlugin } from '@casl/vue'
import { QVueGlobals } from 'quasar'
import VueApollo from 'vue-apollo'
import { Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { mapGetters } from 'vuex'

import { ErrorsPlugin, errorsLink } from '@platyplus/errors'
import { createClient } from '@platyplus/hasura-apollo-client'
import { persistApolloCache } from '@platyplus/vuex-apollo-offline'

import { ability } from '../hasura/ability'
import { ApolloMixin, RouterMixin } from '../mixins'
import { ObjectMap } from '../types/common'
import { QuasarBootOptions } from '../types/quasar'
import { User } from '../types/user'
import MenuItem from '../components/MenuItem.vue'
import { getConfig } from '../helpers'
import { dataIdFromObject } from '../hasura/graphql/apollo'

import { configure } from 'vee-validate'
import { I18nPlugin } from '../modules/i18n'
import messages from '../i18n'

export default async ({ Vue, app, store, router }: QuasarBootOptions) => {
  // TODO: only load the messages of the desired language?
  Vue.use(I18nPlugin, app, store, { messages })

  configure({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultMessage: (field: string, values: any) => {
      // override the field name.
      values._field_ = `"${app.i18n.t(field)}"`
      return app.i18n.t(`validation.${values._rule_}`, values) as string
    }
  })

  Vue.use(ErrorsPlugin, store, { i18n: app.i18n })

  // TODO include in a new Vue module?
  const defaultClient = createClient({
    uri: getConfig().API,
    getToken: () => store.getters['user/encodedToken'],
    dataIdFromObject,
    errorsLink
  })
  await persistApolloCache(defaultClient.cache)
  Vue.use(VueApollo)
  app.apolloProvider = new VueApollo({
    defaultClient,
    defaultOptions: {
      $query: {
        loadingKey: 'loadingQueries' // * Cannot use a key starting with a dollar
      }
    }
  })

  Vue.mixin(Mixins(ApolloMixin))

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

  /**
   * * Loads the user data (profile, table classes, permissions) from Apollo
   */
  if (store.getters['user/authenticated'])
    await store.dispatch('loadUserContext')

  Vue.mixin(Mixins(RouterMixin))

  /**
   * * Main navigation guard.
   * If not authenticated:
   * - Redirects '/' to '/public'
   * - Only allows child routes of the '/public' route.
   * - If another route is requested, store the requested route to the Vuex store and redirect to the authentication page.
   * If authenticated:
   * - If no preferred org unit exists, redirects to the page to select it
   * - Routes otherwise
   */
  router.beforeEach(async (to, from, next) => {
    if (!store.getters['user/authenticated']) {
      if (to.path === '/') return next('/public')
      const publicRoute = to.matched.some(route => {
        return route.path === '/public'
      })
      if (!publicRoute) {
        store.dispatch('navigation/routeRequest', { path: to.fullPath })
        return next('/public/auth/signin')
      }
    } else {
      const user = store.getters['user/profile']
      if (!user)
        console.warn(
          'Non existing user while the user/unauthenticated return true!!!'
        ) // TODO weird error
      if (
        !user.preferred_org_unit &&
        !to.matched.some(route => route.meta.withoutPreferredOrgUnit)
      ) {
        // TODO weird error: when loading app.localhost/data/org_unit/edit with no preferred org_unit
        store.dispatch('navigation/routeRequest', { path: to.fullPath })
        return next('/profile/current-org-unit')
      }
    }
    return next()
  })

  Vue.component('p-menu-item', MenuItem)
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider?: VueApollo
    $from?: Route
    $q: QVueGlobals
    $profile: User
    $error: boolean
    $errors: Error[]
    $authenticated: boolean
    $token: ObjectMap // TODO define the token type?
  }
}
