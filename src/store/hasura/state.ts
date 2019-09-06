import Schema from 'src/hasura/schema/schema'

export interface HasuraState {
  schema: Schema
}

export const state: HasuraState = {
  schema: new Schema([])
}
