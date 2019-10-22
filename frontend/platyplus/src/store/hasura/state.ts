import Schema from '../../hasura/schema/schema'

export interface HasuraState {
  schema: Schema
}

export const state: HasuraState = {
  schema: new Schema([])
}
