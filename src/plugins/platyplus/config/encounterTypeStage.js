import gql from 'graphql-tag'

export const settings = {}

const minimal = gql`
  fragment encounter_type_stage_minimal on encounter_type_stage {
    id
  }
`

export const fragments = {
  minimal
}

export const queries = {}

export const mutations = {
  delete: gql`
    mutation delete_encounter_type_stage(
      $where: encounter_type_stage_bool_exp!
    ) {
      delete_encounter_type_stage(where: $where) {
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
