import { Component, Mixins } from 'vue-property-decorator'

import { ObjectMap } from '../types/common'
import { HasuraMixin } from './hasura'
// import { label } from '../modules/metadata'

@Component
export class ElementMixin extends Mixins(HasuraMixin) {
  public element!: ObjectMap

  public get label() {
    // return label(this.metadata, this.element)
    return 'label'
  }

  public linkToElement(action = 'read') {
    return {
      path: '/data/' + this.table + '/' + action,
      query: this.metadata.idFields.reduce(
        (aggr, field) => ({ ...aggr, [field.name]: this.element[field.name] }),
        {}
      )
    }
  }
}
