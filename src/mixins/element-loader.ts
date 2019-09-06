import { Component, Mixins, Watch } from 'vue-property-decorator'
import { permittedFieldsOf } from '@casl/ability/extra'

import { elementQuery, deleteMutation } from 'src/hasura/graphql'
import { ability } from 'src/boot/user/store'
import {
  BaseProperty,
  ColumnProperty,
  RelationshipProperty
} from 'src/hasura/schema'
import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'

import { ElementMixin } from './element'

@Component({
  apollo: {
    element: {
      query() {
        return elementQuery(this.tableClass, ability)
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
    return pick(this.$route.query, this.tableClass.idColumnNames)
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
    const tableLabel = this.$i18n.t(`${this.tableName}.label`).toString()
    const message = this.$i18n
      .t('delete.label', {
        tableLabel: tableLabel,
        label: this.label
      })
      .toString()
    this.$q
      .dialog({
        title: this.$i18n.t('delete.title').toString(),
        message,
        cancel: true,
        persistent: true
      })
      .onOk(async () => {
        // TODO ask confirmation
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
      })
  }

  protected componentName(property: BaseProperty, prefix: string) {
    // TODO allow custom component name per property
    const possibleComponentName = `${prefix}-${property.componentKind}`
    if (this.$options.components) {
      const components = Object.keys(this.$options.components)
      if (components.includes(possibleComponentName))
        return possibleComponentName
    }
  }

  /**
   * Returns the permitted properties of the element (except ids), whether
   * they are columns or relationship, according to the current ability
   * and given the param action
   * TODO move to a mixin so it can be used at field level as well?
   */
  protected fields(action: string) {
    const tableClass = this.tableClass
    if (tableClass && Object.keys(this.element).length) {
      const permittedColumns = permittedFieldsOf(
        this.$ability,
        action,
        tableClass.name
      )
      const result: BaseProperty[] = []
      for (const property of tableClass.properties) {
        if (property.isColumn) {
          const columnProperty = property as ColumnProperty
          if (
            permittedColumns.includes(columnProperty.name) &&
            !columnProperty.isReference &&
            !columnProperty.isId
          ) {
            result.push(columnProperty)
          }
        } else {
          const relationshipProperty = property as RelationshipProperty
          // TODO if can 'action' reference label fieds (or other fields as well?)
          // const subject =
          //   // TODO a bit too much: such permission filter may be delegated to the array/object sub-component
          //   (relationshipProperty.isMultiple
          //     ? get(this.element, `${relationshipProperty.name}.0`)
          //     : get(this.element, relationshipProperty.name)) ||
          //   relationshipProperty.tableClass.name
          // if (this.$can(action, subject)) result.push(relationshipProperty)
          if (
            this.$can('insert', relationshipProperty.tableClass.name) ||
            this.$can('update', relationshipProperty.tableClass.name)
          ) {
            result.push(relationshipProperty)
          }
        }
      }
      return result
    } else return []
  }

  @Watch('element', { deep: true })
  public onElementChange() {
    this.$store.commit('navigation/setTitle', this.label)
  }
}
