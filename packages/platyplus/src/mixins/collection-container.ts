import { Component, Prop } from 'vue-property-decorator'

import { HasuraMixin } from './hasura'

@Component
export class CollectionContainerMixin extends HasuraMixin {
  @Prop({ type: Array, default: () => [] }) public readonly list!: []
}
