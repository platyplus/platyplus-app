import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { listQuery } from '../graphql'
import { ability } from 'src/boot/user/store'
import { PageMixin } from 'src/mixins/page'

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
