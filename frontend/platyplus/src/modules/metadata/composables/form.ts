import { set, computed, SetupContext } from '@vue/composition-api'

import { ObjectMap } from '../../common'

import { RefOr, unwrap } from '../../common'

import { Metadata, DataObject } from '../types'

export const resetForm = (
  metadata: RefOr<Metadata>,
  element: RefOr<DataObject>,
  form: RefOr<ObjectMap>
) => {
  unwrap(metadata).idFields?.map(field => {
    set(form, field.name, unwrap(element)[field.name] || undefined)
  })
  unwrap(metadata).fields?.map(field => {
    // TODO permissions and initial defaults
    const fieldValue = unwrap(element)[field.name]
    set(form, field.name, fieldValue)
    // const actions: { [key: string]: Function } = {
    //   Column: () => set(form, field.name, fieldValue),
    //   SingleRelationship: () =>
    //     (field as SingleRelationship).mapping.map(({ from, to }) =>
    //       set(form, from.name, unwrap(element)[from.name] || undefined)
    //     ),
    //   OneToManyRelationship: () => {
    //     const data = (fieldValue as DataObject[]) || []
    //     const relationship = field as OneToManyRelationship
    //     set(
    //       form,
    //       field.name,
    //       data.map(item =>
    //         relationship.target.idFields.reduce(
    //           (aggr, column) => ({ ...aggr, [column.name]: item[column.name] }),
    //           {}
    //         )
    //       )
    //     )
    //   }
    // }
    // const typeName = (field as TypeNamedField).__typename
    // const action = actions[typeName]
    // if (action) action()
    // else console.log(typeName)
  })
}

export const useFormFieldValue = <T>(
  props: { value: T },
  { emit }: SetupContext
) =>
  computed({
    get: () => props.value,
    set: value => emit('input', value)
  })
