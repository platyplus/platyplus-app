import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { getApolloClient } from '.'

export const provideApollo = () => {
  provide(DefaultApolloClient, getApolloClient())
  return getApolloClient()
}
