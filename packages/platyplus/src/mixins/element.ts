import { Component, Mixins } from 'vue-property-decorator'

import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'

import { HasuraMixin } from './hasura'

@Component
export class ElementMixin extends Mixins(HasuraMixin) {
  public element!: ObjectMap

  public get label() {
    if (Object.keys(this.element).length) {
      return this.tableClass.label(this.element)
    } else return undefined
  }

  public linkToElement(action = 'read') {
    return {
      path: '/data/' + this.tableName + '/' + action,
      query: pick(this.element, this.tableClass.idColumnNames)
    }
  }
}
