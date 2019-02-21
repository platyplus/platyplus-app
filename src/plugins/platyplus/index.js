import * as metadata from './metadata'
import * as config from './config'
import * as data from './data'

export const settings = {
  ...metadata.settings,
  ...config.settings,
  ...data.settings
}

export const fragments = {
  ...metadata.fragments,
  ...config.fragments,
  ...data.fragments
}

export const queries = {
  ...metadata.queries,
  ...config.queries,
  ...data.queries
}

export const mutations = {
  ...metadata.mutations,
  ...config.mutations,
  ...data.mutations
}

export default ({ app, router, Vue, store }) => {}
