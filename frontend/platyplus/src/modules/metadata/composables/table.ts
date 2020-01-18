import { computed, Ref } from '@vue/composition-api'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import { RouteQuery } from '../../common'

import { Table } from '../types'
import { tableMetadata } from '../getters'

import { tableProps } from './props'
import { pickId } from './element'

export type Metadata = Readonly<Ref<Readonly<Table>>>
export const useMetadata = (props: ExtractPropTypes<typeof tableProps>) =>
  computed(() => tableMetadata(props.table))

// * Gets the element Id from the route query
// ! Interdependency with router, not ideal
export const useElementId = (metadata: Metadata, routeQuery: RouteQuery) =>
  computed(() => pickId(routeQuery, metadata))
