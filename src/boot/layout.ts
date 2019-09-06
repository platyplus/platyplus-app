import MenuItem from 'components/MenuItem.vue'
import { QuasarBootOptions } from 'src/types/quasar'

export default ({ Vue }: QuasarBootOptions) => {
  Vue.component('p-menu-item', MenuItem)
}
