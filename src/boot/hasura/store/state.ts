import { Schema } from 'src/boot/hasura'

export interface HasuraState {
  schema: Schema
}

export const state: HasuraState = {
  schema: ({ classes: [] } as unknown) as Schema
}
