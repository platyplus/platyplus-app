import { computed } from '@vue/composition-api'
import { Table } from '../../modules/metadata/types/objects'
import { ObjectMap } from '../../types/common'
import { label, tableMetadata } from '../../modules/metadata'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { tableProps } from './props'

export const useLabel = (metadata: Partial<Table>, element: ObjectMap) =>
  computed(() => label(metadata, element))

export const useMetadata = ({
  table,
  schema
}: ExtractPropTypes<typeof tableProps>) =>
  computed(() => tableMetadata(table, schema))
