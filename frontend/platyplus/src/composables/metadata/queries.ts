import { useQuery, useResult } from '@vue/apollo-composable'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import { Data } from '../../modules/metadata/types/queries'

import { tableProps } from './props'
import { useMetadata } from './table'
import gql from 'graphql-tag'
import { ObjectMap } from '../../modules/authentication/types'
import { Ref, computed } from '@vue/composition-api'

// TODO rename to useListLoader
export const useList = (props: ExtractPropTypes<typeof tableProps>) => {
  const metadata = useMetadata(props)
  return computed(() => {
    const { result } = useQuery(gql(metadata.value.listQuery), null, () => ({
      // enabled: metadata.value.canSelect
    }))
    // return useResult(result, [], (data: Data) => data.result.nodes).value
    return result.value?.result?.nodes || []
  })
}

export const useElementLoader = (
  props: ExtractPropTypes<typeof tableProps>,
  id: Readonly<Ref<Readonly<ObjectMap> | undefined>>
) => {
  const metadata = useMetadata(props)
  return computed(() => {
    const { result } = useQuery<Data>(
      gql(metadata.value.elementQuery),
      id?.value,
      () => ({
        // enabled: metadata.value.canSelect
      })
    )
    return result.value?.result || {}
  })
}
