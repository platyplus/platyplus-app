import UserMenu from 'components/UserMenu.vue'
import UserHeader from 'components/UserHeader.vue'

export default async ({ app, router, Vue, store }) => {
  await store.dispatch('authentication/loadProfile')
  // eslint-disable-next-line no-new
  new Vue(app)
  Vue.component('user-header', UserHeader)
  Vue.component('user-menu', UserMenu)
}
