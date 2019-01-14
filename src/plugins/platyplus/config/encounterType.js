import gql from 'graphql-tag'

export const settings = {
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment encounter_type_minimal on encounter_type {
    id
    name
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment encounter_type_base on encounter_type {
      ...encounter_type_minimal
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  insert: gql`
    mutation insert_encounter_type($objects: [encounter_type_insert_input!]!) {
      insert_encounter_type(objects: $objects) {
        returning {
          ...encounter_type_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_encounter_type($id: ID!, $name: String) {
      update_encounter_type(
        where: { id: { _eq: $id } }
        _set: { name: $name }
      ) {
        affected_rows
        returning {
          ...encounter_type_base
        }
      }
    }
    ${fragments.base}
  `
}
