import gql from 'graphql-tag'

const settings = {}

const minimal = gql`
  fragment org_unit_type_mapping_minimal on org_unit_type_mapping {
    id
  }
`

const fragments = {
  minimal
}

const queries = {}

const mutations = {
  delete: gql`
    mutation delete_org_unit_type_mapping(
      $where: org_unit_type_mapping_bool_exp!
    ) {
      delete_org_unit_type_mapping(where: $where) {
        affected_rows
      }
    }
  `
  // insert: gql`
  //   mutation insert_org_unit_type_mapping(
  //     $objects: [org_unit_type_mapping_insert_input!]!
  //   ) {
  //     insert_org_unit_type_mapping(objects: $objects) {
  //       returning {
  //         ...org_unit_type_mapping_minimal
  //       }
  //     }
  //   }
  //   ${fragments.minimal}
  // `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
