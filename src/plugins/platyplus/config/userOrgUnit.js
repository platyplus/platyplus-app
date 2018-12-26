import gql from 'graphql-tag'

export const settings = {}

export const fragments = {}

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
  `,
  delete: gql`
    mutation delete_user_org_unit($org_unit_ids: [ID!]!) {
      delete_user_org_unit(where: { org_unit_id: { _in: $org_unit_ids } }) {
        affected_rows
      }
    }
  `
}
