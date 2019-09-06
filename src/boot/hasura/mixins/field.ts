import { Component, Vue, Prop } from 'vue-property-decorator'
import { BaseProperty } from '../schema/properties'
import { ObjectMap } from 'src/types/common'

@Component
export class FieldMixin extends Vue {
  @Prop(Object) public readonly property!: BaseProperty
  @Prop(Object) public readonly element!: ObjectMap
  public get tableName() {
    return this.property.tableClass.name
  }

  public get elementValue() {
    return this.element[this.property.name]
  }

  public get name() {
    return this.property.name
  }

  public get mask() {
    return undefined // TODO
  }
}
