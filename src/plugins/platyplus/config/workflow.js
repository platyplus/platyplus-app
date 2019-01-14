import gql from 'graphql-tag'
import * as stage from './stage'

export const settings = {
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment workflow_minimal on workflow {
    id
    name
  }
`
export const fragments = {
  minimal,
  base: gql`
    fragment workflow_base on workflow {
      ...workflow_minimal
      stages(order_by: { name: asc }) {
        ...stage_minimal
      }
    }
    ${minimal}
    ${stage.fragments.minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_workflow($id: ID!, $name: String) {
      update_workflow(where: { id: { _eq: $id } }, _set: { name: $name }) {
        affected_rows
        returning {
          ...workflow_base
        }
      }
    }
    ${fragments.base}
  `
}
