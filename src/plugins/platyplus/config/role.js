import gql from 'graphql-tag'

export const settings = {
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment role_minimal on role {
    id
    name
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment role_base on role {
      ...role_minimal
      users_aggregate {
        aggregate {
          count
        }
      }
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_role($id: ID!, $name: String) {
      update_role(where: { id: { _eq: $id } }, _set: { name: $name }) {
        affected_rows
        returning {
          ...role_base
        }
      }
    }
    ${fragments.base}
  `
}
