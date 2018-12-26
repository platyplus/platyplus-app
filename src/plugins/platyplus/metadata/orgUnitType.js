import gql from 'graphql-tag'

export const settings = {}

const minimal = gql`
  fragment org_unit_type_minimal on org_unit_type {
    id
    name
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment org_unit_type_base on org_unit_type {
      ...org_unit_type_minimal
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  insert: gql`
    mutation insert_org_unit_type($objects: [org_unit_type_insert_input!]!) {
      insert_org_unit_type(objects: $objects) {
        returning {
          ...org_unit_type_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_org_unit_type($id: ID!, $name: String) {
      update_org_unit_type(where: { id: { _eq: $id } }, _set: { name: $name }) {
        affected_rows
        returning {
          ...org_unit_type_base
        }
      }
    }
    ${fragments.base}
  `
}
