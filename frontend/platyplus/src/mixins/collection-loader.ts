import { Component, Mixins } from 'vue-property-decorator'

import { ability } from '../modules/authorization'
import { listQuery } from '../hasura/graphql'

import { PageMixin } from './page'
import { HasuraMixin } from './hasura'
import { get } from 'object-path'

@Component({
  apollo: {
    list: {
      query() {
        return listQuery(this.tableClass, ability)
      },
      update: data => get(data, [Object.keys(data)[0], 'nodes'])
    }
  }
})
export class CollectionLoaderMixin extends Mixins(HasuraMixin, PageMixin) {
  readonly title = this.tableClass.name + '.label_plural'

  public list = []
}
