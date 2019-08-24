import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { listGraphQlQuery } from '../graphql'
import { ability } from 'src/boot/user/store'

@Component({
  apollo: {
    list: {
      query() {
        return listGraphQlQuery(this.tableClass, ability)
      },
      update: data => data[Object.keys(data)[0]]
    }
  }
})
export class CollectionLoaderMixin extends Mixins(HasuraMixin) {
  public list = []
}
