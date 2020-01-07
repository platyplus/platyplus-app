export const tableProps = {
  table: { type: String, default: '' },
  schema: { type: String, default: 'public' }
}
export const listProps = {
  ...tableProps,
  list: { type: Array, default: () => [] }
}
export const elementProps = {
  ...tableProps,
  element: { type: Object, default: () => ({}) }
}
export const fieldProps = {
  ...elementProps,
  property: { type: String, default: '' } // TODO rename property -> field
}
