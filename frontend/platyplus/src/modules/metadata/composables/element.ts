import { template, pick } from 'lodash'
import { computed, Ref } from '@vue/composition-api'

import { Location } from 'vue-router'

import { unwrap, RefOr } from '../../common'

import { tableMetadata } from '../getters'
import { DataObject, Table, GenericField } from '../types'

import { WrappedData } from './common'

export const elementMetadata = (element?: WrappedData) => {
  const tableName = element && unwrap(element)?.__typename
  if (tableName) return tableMetadata(tableName)
}

export const elementLabel = (element?: WrappedData) =>
  template(elementMetadata(element)?.label?.template)(unwrap(element))

// * Picks the id fields from an object based on a table metadata
export const pickId = (data: WrappedData, metadata?: RefOr<Table>) => {
  const md = elementMetadata(data) || unwrap(metadata)
  if (md?.idFields)
    return pick(
      unwrap(data),
      unwrap(md).idFields?.map(field => field.name) || []
    ) as DataObject
  else return {} // as DataObject
}

export const elementLink = (
  element: WrappedData,
  action: 'read' | 'edit' = 'read'
) => {
  const metadata = elementMetadata(element)
  return computed<Location>(() => ({
    path: '/data/' + metadata?.name + '/' + action,
    query: pickId(element)
  }))
}

export const useElementLabel = (element: WrappedData) =>
  computed(() => elementLabel(element))

export const useComponentName = (action: 'read' | 'edit') => (
  property: Ref<GenericField>
) => {
  const name = unwrap(property).component
  if (name === 'hidden') return null
  return `h-${action}-field-${name}`
}
