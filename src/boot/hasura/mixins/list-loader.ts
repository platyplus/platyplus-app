import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { graphQlQuery } from '../graphql'
import { ability } from 'src/boot/user/store'

@Component({
  apollo: {
    list: {
      query() {
        return graphQlQuery(this.tableClass, ability)
      },
      update: data => data[Object.keys(data)[0]]
    }
  }
})
export class ListLoaderMixin extends Mixins(HasuraMixin) {
  public list = []
}
