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
    },
    stages: {
      table: 'stage',
      map: item => ({
        value: item.id,
        label: item.name
      })
    }
  },
  relations: {
    stages: {
      table: 'encounter_type_stage',
      to: 'stage'
    }
  },
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment encounter_type_minimal on encounter_type {
    id
    name
    title_create
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment encounter_type_base on encounter_type {
      ...encounter_type_minimal
      form
      entityForm
      entity_type_id
      entity_type {
        ...entity_type_minimal
      }
      stages {
        stage {
          id
          name
        }
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
      $entityForm: jsonb
      $name: String
      $title_create: String
      $entity_type_id: ID
    ) {
      update_encounter_type(
        where: { id: { _eq: $id } }
        _set: {
          name: $name
          title_create: $title_create
          entity_type_id: $entity_type_id
          form: $form
          entityForm: $entityForm
        }
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
