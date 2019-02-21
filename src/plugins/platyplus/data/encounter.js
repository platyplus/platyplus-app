import gql from 'graphql-tag'
// import * as entityType from '../metadata/entityType'

export const settings = {
  // options: {
  //   entity_type: {
  //     table: 'entity_type',
  //     map: item => ({
  //       value: item.id,
  //       label: item.name
  //     })
  //   }
  // },
  // orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment encounter_minimal on encounter {
    id
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment encounter_base on encounter {
      ...encounter_minimal
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_encounter($id: ID!, $data: jsonb) {
      update_encounter(where: { id: { _eq: $id } }, _set: { data: $data }) {
        affected_rows
        returning {
          ...encounter_base
        }
      }
    }
    ${fragments.base}
  `
}
