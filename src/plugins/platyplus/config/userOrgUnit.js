import gql from 'graphql-tag'

export const settings = {}

export const fragments = {
  minimal: gql`
    fragment user_org_unit_minimal on user_org_unit {
      id
    }
  `
}

export const queries = {}

export const mutations = {
  delete: gql`
    mutation delete_user_org_unit($where: user_org_unit_bool_exp!) {
      delete_user_org_unit(where: $where) {
        affected_rows
      }
    }
  `
}
