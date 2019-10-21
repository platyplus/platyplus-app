import { ErrorTree } from '../classes'

export interface ErrorsState {
  data: ErrorTree
}

export const state: ErrorsState = {
  data: {}
}
