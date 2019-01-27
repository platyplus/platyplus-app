import gql from 'graphql-tag'

export const settings = {
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment role_minimal on role {
    id
    name
    global
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment role_base on role {
      ...role_minimal
      role_attributions(order_by: { org_unit: { name: asc } }) {
        id
        user {
          id
          username
        }
        org_unit {
          id
          name
        }
      }
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_role($id: ID!, $name: String, $global: Boolean) {
      update_role(
        where: { id: { _eq: $id } }
        _set: { name: $name, global: $global }
      ) {
        affected_rows
        returning {
          ...role_base
        }
      }
    }
    ${fragments.base}
  `
}
