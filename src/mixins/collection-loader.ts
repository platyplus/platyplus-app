import { Component, Mixins } from 'vue-property-decorator'

import { ability } from 'src/hasura/ability'
import { listQuery } from 'src/hasura/graphql'

import { PageMixin } from './page'
import { HasuraMixin } from './hasura'

@Component({
  apollo: {
    list: {
      query() {
        return listQuery(this.tableClass, ability)
      },
      update: data => data[Object.keys(data)[0]]
    }
  }
})
export class CollectionLoaderMixin extends Mixins(HasuraMixin, PageMixin) {
  public list = []

  public get title() {
    return this.$i18n.t(this.tableName + '.label_plural').toString()
  }
}
