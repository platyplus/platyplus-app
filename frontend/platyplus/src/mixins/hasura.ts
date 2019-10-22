import { Component, Vue, Prop } from 'vue-property-decorator'

import TableClass from '../hasura/schema/table-class'

@Component
export class HasuraMixin extends Vue {
  @Prop(Object) public readonly tableClass!: TableClass

  public get tableName() {
    return this.tableClass.name
  }
}
