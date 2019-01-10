import UserMenu from 'components/UserMenu.vue'
import UserHeader from 'components/UserHeader.vue'

export default ({ app, router, Vue, store }) => {
  Vue.component('user-header', UserHeader)
  Vue.component('user-menu', UserMenu)
}
