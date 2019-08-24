import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { elementGraphQlQuery } from '../graphql'
import { ability } from 'src/boot/user/store'
import { BaseProperty } from '..'
import { permittedFieldsOf } from '@casl/ability/extra'
import { ObjectMap } from 'src/types/common'

@Component({
  apollo: {
    element: {
      query() {
        return elementGraphQlQuery(this.tableClass, ability)
      },
      update: data => data[Object.keys(data)[0]][0], // TODO handle the case of non-existing element
      variables() {
        return { id: this.id }
      },
      skip() {
        return !this.id
      }
    }
  }
})
export class ElementLoaderMixin extends Mixins(HasuraMixin) {
  @Prop(String) public id?: string
  public element: ObjectMap = {}

  protected componentName(
    property: BaseProperty,
    prefix: string,
    defaultType: string = 'text'
  ) {
    const propertyType = property ? property.type : defaultType
    const possibleComponentName = `${prefix}-${propertyType}`
    if (this.$options.components) {
      const components = Object.keys(this.$options.components)
      if (components.includes(possibleComponentName))
        return possibleComponentName
    }
    console.log(`No component for the '${propertyType}' property type.`)
    return `${prefix}-${defaultType}`
  }

  /**
   * Shows only the column fields that are not keys (primary or foreign),
   * and the relationships related to the permitted foreign keys
   * TODO 'multiple' relationship fields
   */
  protected fields(action: string) {
    const result = []
    if (this.tableClass) {
      const permittedColumns = permittedFieldsOf(
        this.$ability,
        action,
        this.tableClass.name
      )
      for (const columnName of permittedColumns) {
        const property = this.tableClass.getColumnProperty(columnName)
        if (property) {
          if (property.isReference) {
            result.push(...property.references)
          } else if (!property.isId) {
            result.push(property)
          }
        }
      }
    }
    return result
  }
}
