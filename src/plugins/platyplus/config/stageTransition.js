import gql from 'graphql-tag'

export const settings = {}

const minimal = gql`
  fragment stage_transition_minimal on stage_transition {
    id
  }
`

export const fragments = {
  minimal
}

export const queries = {}

export const mutations = {
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
