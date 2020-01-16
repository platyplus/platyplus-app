import { useQuery, useResult } from '@vue/apollo-composable'

import { ListResult, ElementResult } from '../../modules/metadata/types/queries'

import { Metadata } from './table'
import gql from 'graphql-tag'
import { ObjectMap } from '../../modules/authentication/types'
import { Ref, computed } from '@vue/composition-api'
import { useStore } from '../../store'
import { elementLabel } from './element'
import { DocumentNode } from 'graphql'

export const useListLoader = (metadata: Metadata) => {
  const query = computed(() => gql(metadata?.value.listQuery) as DocumentNode)
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  return useResult(result, [], data => data.result?.nodes)
}

export const useElementLoader = (
  id: Readonly<Ref<Readonly<ObjectMap> | undefined>>,
  metadata: Metadata
) => {
  const store = useStore()
  const query = computed(
    () => gql(metadata?.value.elementQuery) as DocumentNode
  )
  const { result, onResult } = useQuery<ElementResult>(query, id?.value)
  onResult(param =>
    store.commit('navigation/setTitle', {
      label: elementLabel(param?.data.result),
      translate: false
    })
  )
  return useResult(
    result,
    {
      __typename: metadata?.value?.name
    },
    data => data.result
  )
}
