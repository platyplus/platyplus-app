import Vue from 'vue'
import { Store } from 'vuex'

import { metadataModule } from './store'

export interface MetadataOptions {
  store: Store<{}>
  //   app: Vue
}

export function MetadataPlugin(_Vue: typeof Vue, { store }: MetadataOptions) {
  store.registerModule('metadata', metadataModule)
}
