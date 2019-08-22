import { initialRules } from './ability'
import { Rule, User } from '../definitions'
import { ObjectMap } from 'src/types/common'

export interface UserState {
  rules: Rule[]
  profile?: User
  token?: ObjectMap
  encodedToken?: string
}

export const state: UserState = {
  rules: initialRules(),
  profile: undefined,
  token: undefined,
  encodedToken: undefined
}
