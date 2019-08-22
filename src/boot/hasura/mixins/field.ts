import { Component, Vue, Prop } from 'vue-property-decorator'
import { BaseProperty } from '../schema/properties'
import { ObjectMap } from 'src/types/common'

@Component
export class FieldMixin extends Vue {
  @Prop(Object) public property?: BaseProperty
  @Prop(Object) public element?: ObjectMap
  public get tableName() {
    return this.property && this.property.class && this.property.class.name
  }

  public get value() {
    if (this.element && this.property) return this.element[this.property.name]
    else return undefined
  }

  public get name() {
    return this.property && this.property.name
  }

  public get mask() {
    return undefined // TODO
  }
}
