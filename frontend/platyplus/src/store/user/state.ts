import { initialRules } from '../../hasura/ability'
import { ObjectMap } from '../../types/common'
import { Rule } from '../../types/rule'

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
