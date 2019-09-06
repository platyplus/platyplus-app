import Schema from 'src/boot/hasura/schema/schema'

export interface HasuraState {
  schema: Schema
}

export const state: HasuraState = {
  schema: new Schema([])
}
