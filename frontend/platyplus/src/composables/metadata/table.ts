import { computed } from '@vue/composition-api'
import { tableMetadata } from '../../modules/metadata'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { tableProps } from './props'
import { useRouterQuery } from '../router'
import { pickId } from './element'
import { isEmpty } from '../../core'

export const useMetadata = (props: ExtractPropTypes<typeof tableProps>) =>
  computed(() => tableMetadata(props.table))

// * Gets the element Id from the route query
export const useElementId = (props: ExtractPropTypes<typeof tableProps>) => {
  const routerQuery = useRouterQuery()
  const metadata = useMetadata(props)
  return computed(() => pickId(routerQuery, metadata))
}

export const useIsNew = (props: ExtractPropTypes<typeof tableProps>) => {
  const id = useElementId(props)
  return computed(() => !isEmpty(id.value))
}
