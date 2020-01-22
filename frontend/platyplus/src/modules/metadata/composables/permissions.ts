import { computed } from '@vue/composition-api'
import { unwrap } from '../../common'
import { tableMetadata } from '../getters'
import { WrappedData } from './common'

export const useCanDelete = (element: WrappedData) =>
  computed(() => {
    // TODO
    console.warn(`TODO: can delete for ${unwrap(element).__typename}`)
    return true
  })

export const useCanEdit = (element: WrappedData) =>
  computed(() => {
    // TODO
    console.warn(`TODO: can edit for ${unwrap(element).__typename}`)
    return true
  })

export const useCanSave = (element: WrappedData) =>
  computed(() => {
    // TODO
    console.warn(`TODO: can save for ${unwrap(element).__typename}`)
    return true
  })

export const useCanSelect = () => (table: string) =>
  !!tableMetadata(table).canSelect
