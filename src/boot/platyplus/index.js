import * as Tables from './tables'

const importProperty = prop => {
  return Object.keys(Tables).reduce((prev, curr) => {
    prev[curr] = Tables[curr][prop]
    return prev
  }, {})
}

export const settings = importProperty('settings')
export const fragments = importProperty('fragments') // TODO: stop exporting fragments?
export const queries = importProperty('queries')
export const mutations = importProperty('mutations')
export const resolvers = importProperty('resolvers')

export default ({ app, router, Vue, store }) => {}
