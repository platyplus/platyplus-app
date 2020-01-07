import { Component, Watch } from 'vue-property-decorator'

import { ObjectMap } from '../types/common'
import { elementAsOption } from '../modules/metadata'
import { Data } from '../modules/metadata/types/queries'

import { FieldRelationshipMixin } from './field-relationship'
import gql from 'graphql-tag'

@Component({
  apollo: {
    initialOptions: {
      query() {
        return gql(this.optionsQuery)
      },
      update({ result: { nodes } }: Data) {
        // TODO recode: many to many
        // const tableClass = this.relationship.through
        //   ? this.relationship.through.reference
        //   : this.property.reference
        return nodes
          .filter(item => this.$can('insert', item))
          .map(item => elementAsOption(item, this.table))
      }
    }
  }
})
export class FieldOptionsMixin extends FieldRelationshipMixin {
  public options: ObjectMap[] = []
  private initialOptions: ObjectMap[] = []
  public get optionsQuery() {
    // TODO code optionsQuery in the metadata backend
    // TODO this.relationship.through if many to many!!!
    return this.relationship.target.listQuery
  }

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
