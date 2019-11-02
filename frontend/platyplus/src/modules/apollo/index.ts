import _Vue from 'vue'
import { Mixins } from 'vue-property-decorator'
import VueApollo from 'vue-apollo'

import { createClient } from '@platyplus/hasura-apollo-client'
import { errorsLink } from '@platyplus/errors'

import { ApolloMixin } from './mixin'
import { dataIdFromObject } from './helpers'

export interface ApolloOptions {
  app: _Vue
  uri: string
  getToken: () => string
}

export function ApolloPlugin(Vue: typeof _Vue, options: ApolloOptions) {
  const { app, uri, getToken } = options

  const apolloClient = createClient({
    uri,
    getToken,
    dataIdFromObject,
    errorsLink
  })

  Vue.use(VueApollo)
  app.apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        loadingKey: 'loadingQueries' // * Cannot use a key starting with a dollar
      }
    }
  })

  Vue.mixin(Mixins(ApolloMixin))
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider: VueApollo
  }
}
