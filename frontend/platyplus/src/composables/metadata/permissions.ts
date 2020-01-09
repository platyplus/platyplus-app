import { computed } from '@vue/composition-api'
import { DataObject } from '../../modules/metadata/types/queries'
import { RefOr, unwrap } from '../common'

export const useCanDelete = (element: RefOr<DataObject>) =>
  computed(() => {
    // TODO
    console.log(`TODO: can delete for ${unwrap(element).__typename}`)
    return true
  })

export const useCanEdit = (element: RefOr<DataObject>) =>
  computed(() => {
    // TODO
    console.log(`TODO: can edit for ${unwrap(element).__typename}`)
    return true
  })
