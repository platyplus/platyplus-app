import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { graphQlQuery } from '../graphql'

@Component({
  apollo: {
    list: {
      query() {
        return graphQlQuery(this.tableClass)
      },
      update: data => data[Object.keys(data)[0]]
    }
  }
})
export class ListLoaderMixin extends Mixins(HasuraMixin) {
  public list = []
}
