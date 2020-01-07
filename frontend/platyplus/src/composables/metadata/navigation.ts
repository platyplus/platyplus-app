import { computed } from '@vue/composition-api'
import { Table } from '../../modules/metadata/types/objects'
import { ObjectMap } from '../../types/common'

// TODO simplify when the metadata service uses the table name as __typename
const elementLink = (
  metadata: Partial<Table>,
  element: ObjectMap,
  action = 'read'
) => {
  return {
    path: '/data/' + metadata.name + '/' + action,
    query: metadata.idFields?.reduce(
      (aggr, field) => ({ ...aggr, [field.name]: element[field.name] }),
      {}
    )
  }
}

export const useElementReadLink = (
  metadata: Partial<Table>,
  element: ObjectMap
) => computed(() => elementLink(metadata, element))
