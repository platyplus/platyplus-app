import { computed } from '@vue/composition-api'
import { unwrap } from '../common'
import { WrappedData } from './common'

export const useCanDelete = (element: WrappedData) =>
  computed(() => {
    // TODO
    console.log(`TODO: can delete for ${unwrap(element).__typename}`)
    return true
  })

export const useCanEdit = (element: WrappedData) =>
  computed(() => {
    // TODO
    console.log(`TODO: can edit for ${unwrap(element).__typename}`)
    return true
  })
