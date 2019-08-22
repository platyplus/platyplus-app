import gql from 'graphql-tag'
import { ObjectMap } from 'src/types/common'

declare module 'vue/types/vue' {
  interface Vue {
    $profile: User
    $authenticated: boolean
    $token: {} // TODO define the token type?
  }
}

export interface Rule {
  actions: string | string[]
  subject: string | string[]
  conditions?: ObjectMap
  fields?: string[]
  inverted?: boolean // default is `false`
  reason?: string // mainly to specify why user can't do something. See forbidden reasons for details
}

export interface LoginInputPayload {
  username: string
  password: string
}
export interface LoginPayload {
  id: string
  token: string
}

// TODO yurky definition
export interface User {
  id?: string
  preferred_org_unit_id?: string
  preferred_org_unit?: {}
  org_unit_memberships?: { org_unit: { id: string } }[]
}

export const LOGIN_MUTATION = gql`
  mutation user_login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      token
    }
  }
`
// TODO complete and fragment
export const PROFILE_QUERY = gql`
  query user_profile($id: uuid) {
    user(where: { id: { _eq: $id } }) {
      id
      username
      attributes
      locale
      org_unit_memberships {
        id
        org_unit {
          id
          name
        }
      }
      preferred_org_unit {
        id
        name
      }
      role_attributions {
        role {
          id
          name
        }
        org_unit {
          id
          name
        }
      }
    }
  }
`
