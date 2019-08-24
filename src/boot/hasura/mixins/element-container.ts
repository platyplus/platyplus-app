import { Component, Prop, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { ObjectMap } from 'src/types/common'

@Component
export class ElementContainerMixin extends Mixins(HasuraMixin) {
  @Prop({ type: Object, default: () => ({}) }) public element?: ObjectMap

  public get label() {
    if (this.element) {
      if (this.tableClass) {
        return this.tableClass.label(this.element)
      } else return this.element.id
    } else return undefined
  }
}
