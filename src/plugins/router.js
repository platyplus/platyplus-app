// import something here
import { sync } from 'vuex-router-sync'

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => {
  // setup sync
  // const unsync = sync(store, router)
  // TODO: vuex-router-sync is not yet used. Remove the package?
  sync(store, router)
}
