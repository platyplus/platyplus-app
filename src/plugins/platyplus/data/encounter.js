import gql from 'graphql-tag'
import * as encounterType from '../config/encounterType'
import * as orgUnit from '../config/orgUnit'
import * as entity from './entity'

export const settings = {
  // TODO: not correct anymore, remove the entire file?
  defaultValues: {
    data: {},
    entity: {
      attributes: {}
    }
  }
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
      type_id
      type {
        ...encounter_type_base
      }
      states {
        state {
          entity {
            ...entity_base
          }
        }
      }
      org_unit_id
      org_unit {
        ...org_unit_base
      }
      data
    }
    ${entity.fragments.base}
    ${encounterType.fragments.base}
    ${orgUnit.fragments.base}
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_encounter($id: uuid!, $data: jsonb) {
      update_encounter(where: { id: { _eq: $id } }, _append: { data: $data }) {
        affected_rows
        returning {
          ...encounter_base
        }
      }
    }
    ${fragments.base}
  `
}
