import {
  set,
  computed,
  SetupContext,
  reactive,
  Ref,
  watch
} from '@vue/composition-api'
import { isEqual } from 'lodash'

import { Table, DataObject } from '../types'
import { ObjectMap, RefOr, unwrap } from '../../common'
import { elementLabel } from './element'
import { uniqueGraphQlId } from '../helpers'

export type OptionObject = DataObject & {
  _id: string
  _label: string
}

/**
 * * This function adds two generated fields to an element:
 * _label, based on the template of the property
 * _id, based on the primary key fields of the property.
 * This function is used to create a standard label and a standard key
 * regardless of the underlying table class
 */
export const elementToOption = (element?: DataObject | null) =>
  element &&
  ({
    ...element,
    _id: uniqueGraphQlId(element),
    _label: elementLabel(element)
  } as OptionObject)

/**
 * * Converts an 'option element' that has been enriched by the above function
 * * in removing the _id and _label fields
 */
export const optionToElement = (option?: OptionObject | null) => {
  if (option) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _label, ...result } = option
    return result as DataObject
  } else return null
}

export const resetForm = (
  metadata: RefOr<Table>,
  element: RefOr<DataObject>,
  form: RefOr<ObjectMap>
) => {
  unwrap(metadata).idFields?.map(field => {
    set(form, field.name, unwrap(element)[field.name] || undefined)
  })
  unwrap(metadata).fields?.map(field => {
    // TODO permissions and initial defaults
    const fieldValue = unwrap(element)[field.name] // ? JSON.parse(JSON.stringify(unwrap(element)[field.name])) ?
    set(form, field.name, fieldValue)
    // const validator = this.$refs.validator as VeeOberverComponent
    // this.$nextTick(() => !!validator && validator.reset())

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

export const useForm = (metadata: Ref<Table>, element: Ref<DataObject>) => {
  const form = reactive({})
  watch(element, () => resetForm(metadata, element, form))
  return form
}

export const useFormFieldValue = <T>(
  props: { value: T },
  { emit }: SetupContext
) =>
  computed({
    get: () => props.value,
    set: value => emit('input', value)
  })

/**
 * * Returns true if any modification has been done in the form
 */
export const useFormChanged = (
  _metadata: Ref<Table>,
  element: Ref<DataObject>,
  form: Ref<DataObject>
) => computed(() => isEqual(element, form)) // TODO test: really not sure it will work

/**
 * * Returns the changes made in the form based on the initial element
 * ! The objects are compared with JSON.stringify, which requires a strict manipulation
 * TODO the many2many selected options are not correctly generated (returns all the columns instead of id + label columns)
 */
export const useFormChanges = (
  _metadata: Ref<Table>,
  element: Ref<DataObject>,
  form: Ref<DataObject>
) =>
  computed(() => {
    // TODO recode
    // const newValue: ObjectMap = {}
    // for (const property of this.fields(this.action)) {
    //   const name = property.name
    //   if (property.isColumn) {
    //     if (this.form[name] !== this.element[name])
    //       newValue[name] = this.form[name]
    //   } else {
    //     const relationship = property as RelationshipProperty
    //     if (relationship.isMultiple) {
    //       const oldArray = (this.element[name] || []) as ObjectMap[]
    //       const newArray = (this.form[name] || []) as ObjectMap[]
    //       const oldStrArray = oldArray.map(item => JSON.stringify(item))
    //       const newStrArray = newArray.map(item => JSON.stringify(item))
    //       const _add = newStrArray
    //         .filter(item => !oldStrArray.includes(item))
    //         .map(item => JSON.parse(item))
    //       const _remove = oldStrArray
    //         .filter(item => !newStrArray.includes(item))
    //         .map(item => JSON.parse(item))
    //       if (_add.length || _remove.length) {
    //         newValue[name] = { _add, _remove }
    //       }
    //     } else {
    //       if (
    //         JSON.stringify(this.element[name]) !==
    //         JSON.stringify(this.form[name])
    //       )
    //         newValue[name] = this.form[name]
    //     }
    //   }
    // }
    return {}
  })

export const useIsNew = (element: Ref<DataObject | undefined>) =>
  computed(() => {
    if (!element.value) return true
    else {
      if (Object.keys(element.value).length === 0) return true
      if (
        Object.keys(element).length === 1 &&
        Object.keys(element)[0] === '__typename'
      )
        return true
    }
    return false
  })
