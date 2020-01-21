import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Ref, computed, ref } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'

import { useStore } from '../../common'

import { ListResult, ElementResult, Relationship, DataObject } from '../types'

import { Metadata } from './table'
import { elementLabel } from './element'
import { PropertyMetadata } from './property'
import { elementToOption, OptionObject } from './form'

export const useListLoader = (metadata: Metadata) => {
  const query = computed(() => gql(metadata.value.listQuery) as DocumentNode)
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  return useResult(result, [], data => data.result?.nodes)
}

export const useOptionsLoader = (property?: PropertyMetadata) => {
  // TODO reload filteredOptions if options change. E.g. with a watcher
  // TODO this.relationship.through if many to many!!!
  // TODO many to many. Something like:
  // const tableClass = this.relationship.through
  //   ? this.relationship.through.reference
  //   : this.property.reference
  // ? Old piece of code:
  // @Watch('initialOptions', { deep: true })
  // public onOptionsChanged(newValue: ObjectMap[]) {
  //   this.options = newValue
  // }
  const query = computed(
    () =>
      gql(
        (property as PropertyMetadata<Relationship>)?.value?.optionsQuery
      ) as DocumentNode
  )
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  const options = useResult(result, [], data =>
    data.result?.nodes.map(node => elementToOption(node) as OptionObject)
  )
  const filteredOptions = ref(options.value)
  const filter = (val: string, update: Function, abort: Function) => {
    update(() => {
      const value = val.toLowerCase()
      filteredOptions.value = options.value.filter(
        item =>
          item._label &&
          (item._label as string).toLowerCase().indexOf(value) > -1
      )
    })
    abort(() => {
      filteredOptions.value = [...options.value]
    })
  }
  const canRemove = () => true // TODO
  return { filter, options: filteredOptions, canRemove }
}

export const useElementLoader = (
  id: Readonly<Ref<Readonly<DataObject> | undefined>>,
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
