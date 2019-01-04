import gql from 'graphql-tag'

export const settings = {
  orderBy: { name: 'asc' }
}
// TODO: specific settings file and fragments for the 'stage' table
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
      stages {
        id
        name
      }
    }
    ${minimal}
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
