import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Ref, computed, ref } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'

import { useStore } from '../../common'

import { ListResult, ElementResult, Relationship, DataObject } from '../types'

import { Metadata } from './table'
import { elementLabel } from './element'
import { PropertyMetadata } from './property'
import { elementToOption, OptionObject, useIsNew } from './form'
import { validateRules } from '../helpers'

export const useListLoader = (metadata: Metadata) => {
  const query = computed(() => gql(metadata.value.listQuery) as DocumentNode)
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  return useResult(result, [], data => data.result?.nodes)
}

export const useOptionsLoader = (
  element: Ref<DataObject>,
  property?: PropertyMetadata
) => {
  // TODO this.relationship.through if many to many!!!
  // TODO many to many. Something like:
  // const tableClass = this.relationship.through
  //   ? this.relationship.through.reference
  //   : this.property.reference
  const query = computed(
    () =>
      gql(
        (property as PropertyMetadata<Relationship>)?.value?.optionsQuery
      ) as DocumentNode
  )
  const { result } = useQuery<ListResult>(query, undefined, () => ({
    // enabled: metadata.value.canSelect
  }))
  // * Possible options according to the server's result
  const availableOptions = useResult(result, [], data =>
    data.result?.nodes.map(node => elementToOption(node) as OptionObject)
  )
  const inputValue = ref('')
  const isNew = useIsNew(element)
  // * Server options filtered with the user's permissions
  const allowedOptions = computed(() => {
    const rules = isNew.value
      ? property?.value?.insertRules
      : property?.value?.updateRules
    if (rules)
      return availableOptions.value.filter(item =>
        validateRules(
          { ...element.value, [property?.value?.name || '__unknown']: item },
          rules
        )
      )
    else return availableOptions.value
  })
  // * Options filtered with the current user input
  const options = computed(() => {
    if (inputValue.value)
      return allowedOptions.value.filter(
        item => item._label?.toLowerCase().indexOf(inputValue.value) > -1
      )
    else return allowedOptions.value
  })
  const filter = (val: string, update: Function, abort: Function) => {
    update(() => {
      inputValue.value = val.toLowerCase()
    })
    abort(() => {
      inputValue.value = ''
    })
  }
  const canRemove = () => true // TODO
  return { filter, options, canRemove }
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
