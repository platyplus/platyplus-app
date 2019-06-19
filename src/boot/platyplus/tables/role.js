import gql from 'graphql-tag'

const settings = {}

const minimal = gql`
  fragment role_minimal on role {
    id
    name
    global
  }
`

const fragments = {
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

const queries = {
  form: gql`
    query role($where: role_bool_exp) {
      role(where: $where, order_by: [{ name: asc }]) {
        ...role_base
      }
    }
    ${fragments.base}
  `,
  option: gql`
    query role($where: role_bool_exp) {
      role(where: $where) {
        # TODO: default order to be hardcoded
        id
        name
      }
    }
  `
}

const mutations = {
  delete: gql`
    mutation delete_role($where: role_bool_exp!) {
      delete_role(where: $where) {
        affected_rows
      }
    }
  `,
  update: gql`
    mutation update_role($id: uuid!, $name: String, $global: Boolean) {
      result: update_role(
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

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }