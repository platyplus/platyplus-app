import { GenericField } from '../../modules/metadata/types/objects'
import { RefOr, unwrap } from '../common'
import { DataObject, Metadata } from '../../modules/metadata/types/queries'
import { tableMetadata } from '../../modules/metadata'
import { template } from 'lodash'
import { computed, Ref } from '@vue/composition-api'
import { pick } from 'lodash'
import { WrappedData } from './common'
import { Location } from 'vue-router'

export const elementMetadata = (element: WrappedData) => {
  const tableName = unwrap(element)?.__typename
  if (tableName) return tableMetadata(unwrap(element).__typename)
}

export const elementLabel = (element: WrappedData) =>
  template(elementMetadata(element)?.label?.template)(unwrap(element))

// * Picks the id fields from an object based on a table metadata
export const pickId = (data: WrappedData, metadata?: RefOr<Metadata>) => {
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
