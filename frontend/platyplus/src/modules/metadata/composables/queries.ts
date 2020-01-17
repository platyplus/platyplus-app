import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Ref, computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'

import { ObjectMap, useStore } from '../../common'

import { ListResult, ElementResult, Relationship } from '../types'

import { Metadata } from './table'
import { elementLabel, elementToOption } from './element'
import { PropertyMetadata } from './property'

export const useListLoader = (metadata: Metadata) => {
  const query = computed(() => gql(metadata.value.listQuery) as DocumentNode)
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  return useResult(result, [], data => data.result?.nodes)
}

export const useOptionsLoader = (property?: PropertyMetadata) => {
  const query = computed(
    () =>
      gql(
        (property as PropertyMetadata<Relationship>)?.value?.optionsQuery
      ) as DocumentNode
  )
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  return useResult(result, [], data =>
    data.result?.nodes.map(node => elementToOption(node))
  )
}

export const useElementLoader = (
  id: Readonly<Ref<Readonly<ObjectMap> | undefined>>,
  metadata: Metadata
) => {
  const store = useStore()
  const query = computed(
    () => gql(metadata?.value.elementQuery) as DocumentNode
  )
  const { result, onResult } = useQuery<ElementResult>(query, id?.value || {})
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
