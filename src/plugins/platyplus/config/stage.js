import gql from 'graphql-tag'

export const settings = {
  options: {
    workflow: {
      table: 'workflow',
      filter: (item, data, settings) => {
        return data.item.id !== item.id
      },
      map: item => ({
        value: item.id,
        label: item.name
      })
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
      workflow {
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
    mutation update_stage($id: ID!, $name: String, $workflow_id: ID) {
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
