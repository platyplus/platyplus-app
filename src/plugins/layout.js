import UserMenu from 'components/UserMenu.vue'
import UserHeader from 'components/UserHeader.vue'
import JsonEditor from 'components/JsonEditor'

export default ({ app, router, Vue, store }) => {
  Vue.component('user-header', UserHeader)
  Vue.component('user-menu', UserMenu)
  Vue.component('json-editor', JsonEditor)
}
