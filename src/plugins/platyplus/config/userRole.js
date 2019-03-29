import gql from 'graphql-tag'

export const settings = {}

export const fragments = {
  minimal: gql`
    fragment user_role_minimal on user_role {
      id
    }
  `
}

export const queries = {}

export const mutations = {
  delete: gql`
    mutation delete_user_role($where: user_role_bool_exp!) {
      delete_user_role(where: $where) {
        affected_rows
      }
    }
  `
}

export const resolvers = {}
