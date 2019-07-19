import UserMenu from 'components/UserMenu.vue'
import UserHeader from 'components/UserHeader.vue'
import MenuItem from 'components/MenuItem.vue'

export default ({ app, router, Vue, store }) => {
  Vue.component('p-user-header', UserHeader)
  Vue.component('p-user-menu', UserMenu)
  Vue.component('p-menu-item', MenuItem)
}
