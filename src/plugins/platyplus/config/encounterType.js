import gql from 'graphql-tag'
import * as entityType from '../metadata/entityType'

export const settings = {
  options: {
    entity_type: {
      table: 'entity_type',
      map: item => ({
        value: item.id,
        label: item.name
      })
    }
  },
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
      form
      entity_type_id
      entity_type {
        ...entity_type_minimal
      }
    }
    ${minimal}
    ${entityType.fragments.minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_encounter_type(
      $id: ID!
      $form: jsonb
      $name: String
      $entity_type_id: ID
    ) {
      update_encounter_type(
        where: { id: { _eq: $id } }
        _set: { name: $name, entity_type_id: $entity_type_id, form: $form }
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
