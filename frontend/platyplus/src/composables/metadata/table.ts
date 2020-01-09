import { computed } from '@vue/composition-api'
import { ObjectMap } from '../../types/common'
import { tableMetadata } from '../../modules/metadata'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { tableProps } from './props'
import { useRouterQuery } from '../router'

export const useMetadata = ({
  table,
  schema
}: ExtractPropTypes<typeof tableProps>) =>
  computed(() => tableMetadata(table, schema))

export const useElementId = (props: ExtractPropTypes<typeof tableProps>) => {
  const routerQuery = useRouterQuery()
  const metadata = useMetadata(props)
  return computed(() =>
    metadata.value.idFields?.reduce<ObjectMap>(
      (aggr, field) => ({
        ...aggr,
        [field.name]: routerQuery.value[field.name]
      }),
      {}
    )
  )
}
