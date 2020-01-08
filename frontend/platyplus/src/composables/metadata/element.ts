import { useMetadata, useLabel } from './table'
import { useElementReadLink } from './navigation'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { elementProps } from './props'
import { GenericField } from '../../modules/metadata/types/objects'

export const useElementContainer = (
  props: ExtractPropTypes<typeof elementProps>
) => {
  const metadata = useMetadata(props)
  const readLink = useElementReadLink(metadata.value, props.element)
  const label = useLabel(metadata.value, props.element)
  return { metadata, readLink, label }
}

export const useComponentName = (action: 'read' | 'edit') => (
  property: GenericField
) => {
  const name = property.component
  if (name === 'hidden') return null
  return `h-${action}-field-${name}`
}
