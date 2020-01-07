import gql from 'graphql-tag'

export const LOGIN_MUTATION = gql`
  mutation user_login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      token
    }
  }
`

const preferredOrgUnitFragment = gql`
  fragment preferred_org_unit on user {
    preferred_org_unit_id
    preferred_org_unit {
      id
      name
    }
  }
`

// TODO complete and fragment
export const PROFILE_QUERY = gql`
  query user_profile($id: uuid!) {
    profile: user_by_pk(id: $id) {
      id
      username
      attributes
      locale
      org_unit_memberships {
        org_unit {
          id
          name
        }
      }
      ...preferred_org_unit
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
  ${preferredOrgUnitFragment}
`

export const UPDATE_PREFERRED_ORG_UNIT = gql`
  mutation update_preferred_org_unit_id($userId: uuid!, $orgUnitId: uuid!) {
    update_user(
      where: { id: { _eq: $userId } }
      _set: { preferred_org_unit_id: $orgUnitId }
    ) {
      returning {
        ...preferred_org_unit
      }
    }
  }
  ${preferredOrgUnitFragment}
`

export const UPDATE_LOCALE = gql`
  mutation update_locale($userId: uuid!, $locale: String!) {
    update_user(where: { id: { _eq: $userId } }, _set: { locale: $locale }) {
      returning {
        id
        locale
      }
    }
  }
`
