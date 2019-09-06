import { Component, Prop, Mixins } from 'vue-property-decorator'
import { ObjectMap } from 'src/types/common'
import { ElementMixin } from './element'

@Component
export class ElementContainerMixin extends Mixins(ElementMixin) {
  @Prop({ type: Object, default: () => ({}) })
  public readonly element!: ObjectMap
}
