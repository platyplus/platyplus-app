import gql from 'graphql-tag'

const settings = {}

const minimal = gql`
  fragment stage_transition_minimal on stage_transition {
    id
  }
`

const fragments = {
  minimal
}

const queries = {}

const mutations = {
  delete: gql`
    mutation delete_stage_transition($where: stage_transition_bool_exp!) {
      delete_stage_transition(where: $where) {
        affected_rows
      }
    }
  `
  // insert: gql`
  //   mutation insert_stage_transition(
  //     $objects: [stage_transition_insert_input!]!
  //   ) {
  //     insert_stage_transition(objects: $objects) {
  //       returning {
  //         ...stage_transition_minimal
  //       }
  //     }
  //   }
  //   ${fragments.minimal}
  // `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
