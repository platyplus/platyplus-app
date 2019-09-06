import { Component, Watch } from 'vue-property-decorator'

import { ObjectMap } from 'src/types/common'
import { optionsQuery } from 'src/hasura/graphql/operations'
import { elementAsOption } from 'src/hasura/graphql/common'
import { ability } from 'src/boot/user/store'

import { FieldRelationshipMixin } from './field-relationship'

@Component({
  apollo: {
    initialOptions: {
      query() {
        return optionsQuery(this.property, ability)
      },
      update(data: Record<string, ObjectMap[]>) {
        const tableClass = this.relationship.through
          ? this.relationship.through.reference
          : this.property.reference
        return data[Object.keys(data)[0]]
          .filter(item => this.$can('insert', item))
          .map(item => elementAsOption(item, tableClass))
      }
    }
  }
})
export class FieldOptionsMixin extends FieldRelationshipMixin {
  public options: ObjectMap[] = []
  private initialOptions: ObjectMap[] = []

  public filterOptions(val: string, update: Function, abort: Function) {
    update(() => {
      const value = val.toLowerCase()
      this.options = this.initialOptions.filter(
        item =>
          item._label &&
          (item._label as string).toLowerCase().indexOf(value) > -1
      )
    })
    abort(() => {
      this.options = this.initialOptions
    })
  }

  @Watch('initialOptions', { deep: true })
  public onOptionsChanged(newValue: ObjectMap[]) {
    this.options = newValue
  }
}
