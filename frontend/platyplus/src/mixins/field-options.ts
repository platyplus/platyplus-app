import { Watch } from 'vue-property-decorator'

import { ObjectMap } from '../modules/common'

// @Component({
//   apollo: {
//     initialOptions: {
//       query() {
//         return gql(this.optionsQuery)
//       }
// TODO recode: many to many
// update({ result: { nodes } }: Data) {
// const tableClass = this.relationship.through
//   ? this.relationship.through.reference
//   : this.property.reference
// return nodes
//   .filter(item => this.$can('insert', item))
//   .map(item => elementAsOption(item, this.table))
// }
//     }
//   }
// })
export class FieldOptionsMixin {
  public options: ObjectMap[] = []
  private initialOptions: ObjectMap[] = []
  public get optionsQuery() {
    // TODO code optionsQuery in the metadata backend
    // TODO this.relationship.through if many to many!!!
    // return this.relationship.target.listQuery
    return
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
