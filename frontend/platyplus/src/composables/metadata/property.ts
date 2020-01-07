import { createComponent } from '@vue/composition-api'
import { computed } from '@vue/composition-api'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import { ManyToManyRelationship } from '../../modules/metadata/types/objects'
import { ObjectMap } from '../../types/common'
import { tableMetadata } from '../../modules/metadata'

import { fieldProps } from './props'

export const useFieldMetadata = ({
  table,
  schema,
  property
}: ExtractPropTypes<typeof fieldProps>) =>
  computed(() =>
    tableMetadata(table, schema).fields?.find(field => field.name === property)
  )

export const useFieldValue = (props: ExtractPropTypes<typeof fieldProps>) => {
  const propertyMetadata = useFieldMetadata(props)
  return computed(() => {
    const value = props.element[props.property]
    if (value && propertyMetadata.value?.kind === 'many-to-many') {
      const relationship = propertyMetadata.value as Partial<
        ManyToManyRelationship
      >
      if (relationship.through) {
        const name = relationship.through.name
        return (value as ObjectMap[]).map(item => item[name])
      }
    }
    return value
  })
}

export const fieldComponent = createComponent({
  props: { ...fieldProps },
  setup(props) {
    const value = useFieldValue(props)
    return { value }
  }
})
