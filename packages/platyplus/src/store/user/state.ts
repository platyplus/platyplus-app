import { initialRules } from 'src/hasura/ability'
import { ObjectMap } from 'src/types/common'
import { Rule } from 'src/types/rule'

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
