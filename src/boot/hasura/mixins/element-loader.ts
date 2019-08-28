import { Component, Mixins } from 'vue-property-decorator'
import { readQuery, deleteMutation } from '../graphql'
import { ability } from 'src/boot/user/store'
import { BaseProperty } from '..'
import { permittedFieldsOf } from '@casl/ability/extra'
import { ObjectMap } from 'src/types/common'
import { ElementMixin } from './element'
import { pick } from 'src/helpers'

@Component({
  apollo: {
    element: {
      query() {
        return readQuery(this.tableClass, ability)
      },
      update: data => data[Object.keys(data)[0]][0], // TODO handle the case of non-existing element
      variables() {
        return this.id
      },
      skip() {
        return this.isNew
      }
    }
  }
})
export class ElementLoaderMixin extends Mixins(ElementMixin) {
  public element: ObjectMap = {}

  protected get isNew() {
    return Object.keys(this.id).length == 0
  }

  protected get id() {
    if (this.tableClass) {
      return pick(this.$route.query, this.tableClass.idColumnNames)
    } else return {}
  }

  private navigate(action: string, id: ObjectMap) {
    this.$router.replace({
      path: `/data/${this.tableName}/${action}`,
      query: id as Record<string, string | (string | null)[] | null | undefined>
    })
  }

  public read(id: ObjectMap = this.id) {
    this.navigate('read', id)
  }

  public edit(id: ObjectMap = this.id) {
    this.navigate('edit', id)
  }

  public remove() {
    const tableLabel = this.$i18n.t(`${this.tableName}.label`) as string
    const message = this.$i18n.t('delete.label', {
      tableLabel: tableLabel,
      label: this.label
    }) as string
    this.$q
      .dialog({
        title: this.$i18n.t('delete.title') as string,
        message,
        cancel: true,
        persistent: true
      })
      .onOk(async () => {
        // TODO ask confirmation
        if (this.tableClass) {
          if (this.$ability.can('delete', this.element)) {
            const mutation = deleteMutation(this.tableClass, this.$ability)
            // TODO catch errors
            await this.$apollo.mutate({
              mutation,
              variables: this.id
            })
            // TODO remove in the cached list
            this.$router.replace(`/data/${this.tableName}`)
          }
        }
      })
  }

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
    const tableClass = this.tableClass
    if (tableClass) {
      const columns = permittedFieldsOf(this.$ability, action, tableClass.name)
      return columns.reduce<BaseProperty[]>((result, columnName) => {
        const property = tableClass.getColumnProperty(columnName)
        if (property) {
          if (property.isReference) {
            result.push(...property.references)
          } else if (!property.isId) {
            result.push(property)
          }
        }
        return result
      }, [])
    } else return []
  }
}
