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
      encounter_types(order_by: { name: asc }) {
        # not through a fragment: circular reference
        id
        name
      }
    }
    ${minimal}
  `
}

export const queries = {
  option: gql`
    query entity_type_options($where: entity_type_bool_exp) {
      entity_type(where: $where) {
        # TODO: default order to be hardcoded
        id
        name
      }
    }
  `
}

export const mutations = {
  delete: gql`
    mutation delete_entity_type($where: entity_type_bool_exp!) {
      delete_entity_type(where: $where) {
        affected_rows
      }
    }
  `,
  // insert: gql`
  //   mutation insert_entity_type($objects: [entity_type_insert_input!]!) {
  //     insert_entity_type(objects: $objects) {
  //       returning {
  //         ...entity_type_base
  //       }
  //     }
  //   }
  //   ${fragments.base}
  // `,
  update: gql`
    mutation update_entity_type($id: uuid!, $name: String) {
      result: update_entity_type(
        where: { id: { _eq: $id } }
        _set: { name: $name }
      ) {
        affected_rows
        returning {
          ...entity_type_base
        }
      }
    }
    ${fragments.base}
  `
}
