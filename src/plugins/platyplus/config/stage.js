import gql from 'graphql-tag'
import * as encounterType from './encounterType'

export const settings = {
  options: {
    workflow: {
      table: 'workflow',
      filter: (item, data, settings) => data.item.id !== item.id,
      map: item => ({
        value: item.id,
        label: item.name
      })
    },
    previous: {
      table: 'stage',
      filter: (item, data, settings) =>
        item.workflow_id === data.item.workflow_id,
      map: item => ({
        value: item.id,
        label: item.name
      })
    },
    next: {
      table: 'stage',
      filter: (item, data, settings) =>
        item.workflow_id === data.item.workflow_id,
      map: item => ({
        value: item.id,
        label: item.name
      })
    }
  },
  relations: {
    previous: {
      table: 'stage_transition',
      from: 'previous',
      to: 'next'
    },
    next: {
      table: 'stage_transition',
      from: 'next',
      to: 'previous'
    }
  },
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment stage_minimal on stage {
    id
    name
  }
`
export const fragments = {
  minimal,
  base: gql`
    fragment stage_base on stage {
      ...stage_minimal
      workflow_id
      encounter_types {
        stage {
          ...stage_minimal
        }
        encounter_type {
          ...encounter_type_base
        }
      }
      workflow {
        id
        name
      }
      previous {
        next {
          ...stage_minimal
        }
      }
      next {
        previous {
          ...stage_minimal
        }
      }
    }
    ${minimal}
    ${encounterType.fragments.base}
  `
}

export const queries = {}

export const mutations = {
  delete: gql`
    mutation delete_stage($where: stage_bool_exp!) {
      delete_stage(where: $where) {
        affected_rows
      }
    }
  `,
  update: gql`
    mutation update_stage($id: uuid!, $name: String, $workflow_id: uuid) {
      update_stage(
        where: { id: { _eq: $id } }
        _set: { name: $name, workflow_id: $workflow_id }
      ) {
        affected_rows
        returning {
          ...stage_base
        }
      }
    }
    ${fragments.base}
  `
}
