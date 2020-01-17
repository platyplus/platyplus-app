import { createComponent, Ref } from '@vue/composition-api'
import { computed } from '@vue/composition-api'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'

import { ObjectMap } from '../../common'

import { useTranslator } from '../../i18n'

import { tableMetadata } from '../getters'
import { GenericField, DataObject, ManyToManyRelationship } from '../types'

import { fieldProps } from './props'

export const useFieldMetadata = ({
  table,
  property
}: ExtractPropTypes<typeof fieldProps>) =>
  computed(() =>
    tableMetadata(table).fields?.find(field => field.name === property)
  )

export type PropertyMetadata<T = GenericField> = Ref<T | undefined>

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
      const translate = useTranslator()
      return { value, translate }
    }
  })
