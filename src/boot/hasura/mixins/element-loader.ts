import { Component, Prop, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { elementGraphQlQuery } from '../graphql'

@Component({
  apollo: {
    element: {
      query() {
        return elementGraphQlQuery(this.tableClass)
      },
      update: data => data[Object.keys(data)[0]][0], // TODO handle the case of non-existing element
      variables() {
        return { id: this.id }
      },
      skip() {
        return !this.id
      }
    }
  }
})
export class ElementLoaderMixin extends Mixins(HasuraMixin) {
  @Prop(String) public id?: string
  public element = {}
}
