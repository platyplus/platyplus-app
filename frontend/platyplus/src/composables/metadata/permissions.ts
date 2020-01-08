import { computed, Ref } from '@vue/composition-api'
import { DataObject } from '../../modules/metadata/types/queries'

export const useCanDelete = (element: Ref<DataObject>) =>
  computed(() => {
    // TODO
    console.log(`TODO: can delete for ${element.value.__typename}`)
    return true
  })
