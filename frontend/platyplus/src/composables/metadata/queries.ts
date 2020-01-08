import { useQuery, useResult } from '@vue/apollo-composable'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import { Data } from '../../modules/metadata/types/queries'

import { tableProps } from './props'
import { useMetadata } from './table'
import gql from 'graphql-tag'
import { ObjectMap } from '../../modules/authentication/types'
import { Ref } from '@vue/composition-api'

// TODO rename to useListLoader
export const useList = (props: ExtractPropTypes<typeof tableProps>) => {
  const metadata = useMetadata(props)
  const { result } = useQuery(gql(metadata.value.listQuery))
  return useResult(result, [], (data: Data) => data.result.nodes)
}

export const useElementLoader = (
  props: ExtractPropTypes<typeof tableProps>,
  id: Readonly<Ref<Readonly<ObjectMap> | undefined>>
) => {
  const metadata = useMetadata(props)
  const { result } = useQuery(gql(metadata.value.elementQuery), id?.value, {})
  return useResult(result, {}, data => data.result)
}
