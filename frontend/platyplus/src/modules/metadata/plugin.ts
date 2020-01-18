import { Store } from 'vuex'

import { metadataModule } from './store'

export function provideMetadata(store: Store<{}>) {
  store.registerModule('metadata', metadataModule)
}
