import gql from 'graphql-tag'

const settings = {}

const fragments = {
  minimal: gql`
    fragment user_role_minimal on user_role {
      id
    }
  `
}

const queries = {}

const mutations = {
  delete: gql`
    mutation delete_user_role($where: user_role_bool_exp!) {
      delete_user_role(where: $where) {
        affected_rows
      }
    }
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
