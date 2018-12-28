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
  insert: gql`
    mutation insert_user_org_unit($objects: [user_org_unit_insert_input!]!) {
      insert_user_org_unit(objects: $objects) {
        returning {
          id
        }
      }
    }
  `
}
