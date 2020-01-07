import { Component, Mixins, Watch } from 'vue-property-decorator'
import { get } from 'object-path'
import gql from 'graphql-tag'

import { Data } from '../modules/metadata/types/queries'
import { ObjectMap } from '../types/common'
import { isEmpty } from '../core'
import { GenericField } from '../modules/metadata/types/objects'

import { ElementMixin } from './element'

@Component({
  apollo: {
    element: {
      query() {
        return gql(this.metadata.elementQuery)
      },
      update: ({ result }: Data) => result, // TODO handle the case of non-existing element
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
    return isEmpty(this.id)
  }

  protected get id() {
    return this.metadata.idFields.reduce(
      (aggr, field) => ({
        ...aggr,
        [field.name]: this.$route.query[field.name]
      }),
      {}
    )
  }

  private navigate(action: string, id: ObjectMap) {
    this.$router.replace({
      path: `/data/${this.table}/${action}`,
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
    const tableLabel = this.$i18n.t(`${this.table}.label`).toString()
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
        if (this.$can('delete', this.element)) {
          // TODO recode
          // const mutation = deleteMutation(this.tableClass, this.$ability)
          // // TODO catch errors
          // await this.$apollo.mutate({
          //   mutation,
          //   variables: this.id
          // })
          // // TODO remove in the cached list
          this.$router.replace(`/data/${this.table}`)
        }
      })
  }

  protected componentName(property: GenericField, prefix: string) {
    // TODO allow custom component name per property
    const possibleComponentName = `${prefix}-${property.kind}`
    if (get(this.$options.components as ObjectMap, possibleComponentName)) {
      return possibleComponentName
    }
    // TODO or else?
  }

  /**
   * Returns the permitted properties of the element (except ids), whether
   * they are columns or relationship, according to the current ability
   * and given the param action
   * TODO move to a mixin so it can be used at field level as well?
   */
  protected fields(action: string) {
    return this.metadata.fields // TODO filter according to the action
  }

  @Watch('element', { deep: true })
  public onElementChange() {
    this.$store.commit('navigation/setTitle', {
      label: this.label,
      translate: false
    })
  }
}
