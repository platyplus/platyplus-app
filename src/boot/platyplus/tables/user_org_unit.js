import gql from 'graphql-tag'

const settings = {}

const fragments = {
  minimal: gql`
    fragment user_org_unit_minimal on user_org_unit {
      id
    }
  `
}

const queries = {}

const mutations = {
  delete: gql`
    mutation delete_user_org_unit($where: user_org_unit_bool_exp!) {
      delete_user_org_unit(where: $where) {
        affected_rows
      }
    }
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
