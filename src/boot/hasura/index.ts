import { QuasarBootOptions } from 'src/types/quasar'
import { hasuraStoreModule } from './store'

export * from './schema'
export * from './mixins'
export * from './graphql'

export default ({ store }: QuasarBootOptions) => {
  store.registerModule('hasura', hasuraStoreModule)
}
