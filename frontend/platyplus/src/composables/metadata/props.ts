import { DataObject } from '../../modules/metadata/types/queries'
import { PropType } from '@vue/composition-api'

export const tableProps = {
  table: { type: String, default: '' }
}
export const listProps = {
  ...tableProps,
  list: { type: Array as PropType<DataObject[]>, default: () => [] }
}
export const elementProps = {
  ...tableProps,
  element: {
    type: Object as PropType<DataObject>,
    required: true,
    default: () => ({} as DataObject)
  }
}
export const fieldProps = {
  ...elementProps,
  property: { type: String, required: true, default: '' } // TODO rename property -> field
}
