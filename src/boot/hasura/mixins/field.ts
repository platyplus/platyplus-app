import { Component, Vue, Prop } from 'vue-property-decorator'
import { BaseProperty } from '../schema/properties'
import { ObjectMap } from 'src/types/common'

@Component
export class FieldMixin extends Vue {
  @Prop(Object) public property?: BaseProperty
  @Prop(Object) public element?: ObjectMap
  public get tableName() {
    return (
      this.property && this.property.tableClass && this.property.tableClass.name
    )
  }

  public get elementValue() {
    if (this.element && this.property) return this.element[this.property.name]
    else return {}
  }

  public get name() {
    return this.property && this.property.name
  }

  public get mask() {
    return undefined // TODO
  }
}
