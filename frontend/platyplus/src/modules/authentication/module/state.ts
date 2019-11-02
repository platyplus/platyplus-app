import { initialRules } from '../../authorization'
import { ObjectMap } from '../types'
import { Rule } from '../../authorization/types'

export interface UserState {
  rules: Rule[]
  token?: ObjectMap
  encodedToken?: string
}

export const state: UserState = {
  rules: initialRules(),
  token: undefined,
  encodedToken: undefined
}
