import gql from 'graphql-tag'

const settings = {}

const fragments = {
  minimal: gql`
    fragment org_unit_workflow_minimal on org_unit_workflow {
      id
    }
  `
}

const queries = {}

const mutations = {
  delete: gql`
    mutation delete_org_unit_workflow($where: org_unit_workflow_bool_exp!) {
      delete_org_unit_workflow(where: $where) {
        affected_rows
      }
    }
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
