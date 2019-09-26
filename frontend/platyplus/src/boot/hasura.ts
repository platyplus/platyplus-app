import { abilitiesPlugin } from '@casl/vue'
import { QVueGlobals } from 'quasar'
import VueApollo from 'vue-apollo'
import { Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { mapGetters } from 'vuex'

import { ability } from 'src/hasura/ability'

import { ApolloMixin, RouterMixin } from 'src/mixins'
import { ObjectMap } from 'src/types/common'
import { QuasarBootOptions } from 'src/types/quasar'
import { User } from 'src/types/user'
import { createClient } from '@platyplus/hasura-apollo-client'
import { persistApolloCache } from '@platyplus/vuex-apollo-offline'
import MenuItem from 'src/components/MenuItem.vue'
import Input from 'src/components/Input.vue'
import { getConfig } from 'src/helpers'
import { ApolloError } from 'apollo-client'
import { dataIdFromObject } from 'src/hasura/graphql/apollo'

export default async ({ Vue, app, store, router }: QuasarBootOptions) => {
  const uri = getConfig().API
  const defaultClient = createClient({
    uri,
    getToken: () => store.getters['user/encodedToken'],
    dataIdFromObject
  })
  await persistApolloCache(defaultClient.cache)

  Vue.use(VueApollo)
  app.apolloProvider = new VueApollo({
    defaultClient,
    defaultOptions: {
      $query: {
        loadingKey: 'loadingQueries' // * Cannot use a key starting with a dollar
      }
    },
    errorHandler({ graphQLErrors, networkError }: ApolloError) {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )
      }
      if (networkError) {
        console.warn(`[Network error]: ${networkError}`)
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

  Vue.component('p-input', Input)
  Vue.component('p-menu-item', MenuItem)
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider?: VueApollo
    $from?: Route
    $q: QVueGlobals
    $profile: User
    $authenticated: boolean
    $token: ObjectMap // TODO define the token type?
  }
}
