import { Store } from 'vuex'
import Vue from 'vue'
import { metadataModule } from './store'
import { CommonPlugin } from '../common'
import introspectionQueryResultData from './fragmentTypes.json'

type Options = {
  store: Store<{}>
}

export function MetadataPlugin(_Vue: typeof Vue, { store }: Options) {
  Vue.use(CommonPlugin, { store, introspectionQueryResultData })
  store.registerModule('metadata', metadataModule)
}
