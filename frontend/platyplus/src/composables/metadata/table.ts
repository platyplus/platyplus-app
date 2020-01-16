import { computed, Ref } from '@vue/composition-api'
import { tableMetadata } from '../../modules/metadata'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { tableProps } from './props'
import { RouteQuery } from '../router'
import { pickId } from './element'
import { Metadata as MetadataObjectType } from '../../modules/metadata/types/queries'

export type Metadata = Readonly<Ref<Readonly<MetadataObjectType>>>
export const useMetadata = (props: ExtractPropTypes<typeof tableProps>) =>
  computed(() => tableMetadata(props.table))

// * Gets the element Id from the route query
export const useElementId = (metadata: Metadata, routeQuery: RouteQuery) =>
  computed(() => pickId(routeQuery, metadata))
