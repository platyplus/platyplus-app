import * as metadata from './metadata'
import * as config from './config'

export const settings = {
  ...metadata.settings,
  ...config.settings
}

export const fragments = {
  ...metadata.fragments,
  ...config.fragments
}

export const queries = {
  ...metadata.queries,
  ...config.queries
}

export const mutations = {
  ...metadata.mutations,
  ...config.mutations
}

export default ({ app, router, Vue, store }) => {}
