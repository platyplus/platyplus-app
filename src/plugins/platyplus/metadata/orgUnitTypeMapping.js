import gql from 'graphql-tag'

export const settings = {}

const minimal = gql`
  fragment org_unit_type_mapping_minimal on org_unit_type_mapping {
    id
  }
`

export const fragments = {
  minimal
}

export const queries = {}

export const mutations = {
  insert: gql`
    mutation insert_org_unit_type_mapping(
      $objects: [org_unit_type_mapping_insert_input!]!
    ) {
      insert_org_unit_type_mapping(objects: $objects) {
        returning {
          ...org_unit_type_mapping_minimal
        }
      }
    }
    ${fragments.minimal}
  `
}
