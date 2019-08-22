import { Component, Prop, Mixins } from 'vue-property-decorator'
import Handlebars from 'handlebars'
import { HasuraMixin } from './hasura'
import { ObjectMap } from 'src/types/common'

@Component
export class ElementContainerMixin extends Mixins(HasuraMixin) {
  @Prop({ type: Object, default: () => ({}) }) public element?: ObjectMap

  public get labelTemplate() {
    if (
      this.tableClass &&
      this.tableClass.properties.some(
        property =>
          property.name === 'name' &&
          this.element &&
          this.element[property.name]
      )
    )
      return '{{name}}'
    return '{{id}}' // TODO customise
  }

  public get label() {
    const template = Handlebars.compile(this.labelTemplate)
    return template(this.element)
  }
}
