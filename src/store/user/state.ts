import { initialRules } from 'src/hasura/ability'
import { ObjectMap } from 'src/types/common'
import { Rule } from 'src/types/rule'
import { User } from 'src/types/user'

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
