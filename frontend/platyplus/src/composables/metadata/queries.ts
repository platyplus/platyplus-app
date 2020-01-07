import { useQuery, useResult } from '@vue/apollo-composable'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import { Data } from '../../modules/metadata/types/queries'

import { tableProps } from './props'
import { useMetadata } from './table'
import gql from 'graphql-tag'

export const useList = (props: ExtractPropTypes<typeof tableProps>) => {
  const metadata = useMetadata(props)
  const { result } = useQuery(gql(metadata.value.listQuery))
  return useResult(result, [], (data: Data) => data.result.nodes)
}
