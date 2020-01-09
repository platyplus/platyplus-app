import { computed } from '@vue/composition-api'
import { tableMetadata } from '../../modules/metadata'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { tableProps } from './props'
import { useRouterQuery } from '../router'
import { pickId } from './element'

export const useMetadata = (props: ExtractPropTypes<typeof tableProps>) =>
  computed(() => tableMetadata(props.table, props.schema))

// * Gets the element Id from the route query
export const useElementId = (props: ExtractPropTypes<typeof tableProps>) => {
  const routerQuery = useRouterQuery()
  const metadata = useMetadata(props)
  return computed(() => pickId(routerQuery, metadata))
}
