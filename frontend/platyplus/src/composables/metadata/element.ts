import { ObjectMap } from '../../types/common'
import { useMetadata, useLabel } from './table'
import { useElementReadLink } from './navigation'

export const useElementContainer = (
  element: ObjectMap,
  table: string,
  schema = 'public'
) => {
  const metadata = useMetadata({ table, schema })
  const readLink = useElementReadLink(metadata.value, element)
  const label = useLabel(metadata.value, element)
  return { metadata, readLink, label }
}
