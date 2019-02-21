import gql from 'graphql-tag'

export const settings = {}

export const fragments = {
  minimal: gql`
    fragment org_unit_workflow_minimal on org_unit_workflow {
      id
    }
  `
}

export const queries = {}

export const mutations = {}
