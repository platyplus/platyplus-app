import { computed } from '@vue/composition-api'
import { RefOr, unwrap } from '../common'
import { elementMetadata } from './element'
import { DataObject } from '../../modules/metadata/types/queries'

const elementLink = (element: RefOr<DataObject>, action = 'read') => {
  const metadata = elementMetadata(element)
  return {
    path: '/data/' + metadata?.name + '/' + action,
    query: metadata?.idFields?.reduce(
      (aggr, field) => ({
        ...aggr,
        [field.name]: unwrap(element)[field.name]
      }),
      {}
    )
  }
}

export const useElementReadLink = (element: RefOr<DataObject>) =>
  computed(() => elementLink(element))
