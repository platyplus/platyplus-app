import { createComponent, Ref } from '@vue/composition-api'
import { computed } from '@vue/composition-api'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import {
  ManyToManyRelationship,
  GenericField
} from '../../modules/metadata/types/objects'
import { ObjectMap } from '../../types/common'
import { tableMetadata } from '../../modules/metadata'

import { fieldProps } from './props'
import { DataObject } from '../../modules/metadata/types/queries'

export const useFieldMetadata = ({
  table,
  property
}: ExtractPropTypes<typeof fieldProps>) =>
  computed(() =>
    tableMetadata(table).fields?.find(field => field.name === property)
  )

type PropertyMetadata = Ref<GenericField | undefined>

export const useFieldValue = (
  props: ExtractPropTypes<typeof fieldProps>,
  propertyMetadata: PropertyMetadata
) =>
  computed(() => {
    const value = (props.element as DataObject)[props.property] // TODO ugly
    if (value && propertyMetadata?.value?.component === 'many-to-many') {
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

// TODO generic <T> that gives the field type. T by default is GenericField
// TODO -> export const fieldComponent = <T = GenericField>() => createComponent(... useFieldValue<T>(props) ...)
// TODO and then use fieldComponent<ManyToManyRelationship>()
export const fieldComponent = () =>
  createComponent({
    props: { ...fieldProps },
    setup(props) {
      const propertyMetadata = useFieldMetadata(props)
      const value = useFieldValue(props, propertyMetadata)
      return { value }
    }
  })
