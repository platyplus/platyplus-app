import { useElementReadLink } from './navigation'
import { GenericField } from '../../modules/metadata/types/objects'
import { RefOr, unwrap } from '../common'
import { DataObject } from '../../modules/metadata/types/queries'
import { tableMetadata } from '../../modules/metadata'
import { template } from 'lodash'
import { computed } from '@vue/composition-api'

// ? What is the typename given by Hasura when there are multiple schemas?
export const elementMetadata = (element: RefOr<DataObject>) => {
  const tableName = unwrap(element).__typename
  if (tableName) return tableMetadata(unwrap(element).__typename)
}

export const elementLabel = (element: RefOr<DataObject>) =>
  template(elementMetadata(element)?.label?.template)(unwrap(element))

export const useElementLabel = (element: RefOr<DataObject>) =>
  computed(() => elementLabel(element))

export const useElementContainer = (element: RefOr<DataObject>) => {
  const readLink = useElementReadLink(element)
  const label = useElementLabel(element)
  return { readLink, label }
}

export const useComponentName = (action: 'read' | 'edit') => (
  property: RefOr<GenericField>
) => {
  const name = unwrap(property).component
  if (name === 'hidden') return null
  return `h-${action}-field-${name}`
}
