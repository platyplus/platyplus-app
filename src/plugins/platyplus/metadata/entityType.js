import gql from 'graphql-tag'

export const settings = {
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment entity_type_minimal on entity_type {
    id
    name
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment entity_type_base on entity_type {
      ...entity_type_minimal
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  insert: gql`
    mutation insert_entity_type($objects: [entity_type_insert_input!]!) {
      insert_entity_type(objects: $objects) {
        returning {
          ...entity_type_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_entity_type($id: ID!, $name: String) {
      update_entity_type(where: { id: { _eq: $id } }, _set: { name: $name }) {
        affected_rows
        returning {
          ...entity_type_base
        }
      }
    }
    ${fragments.base}
  `
}
