import { ObjectMap, User } from '../types'

export interface UserState {
  token?: ObjectMap
  encodedToken?: string
  profile?: User
}

export const state: UserState = {
  token: undefined,
  encodedToken: undefined,
  profile: undefined
}
