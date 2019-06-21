import gql from 'graphql-tag'
import stage from './stage'

const settings = {
  options: {
    org_units: {
      table: 'org_unit',
      where: {}
    }
  },
  relations: {
    org_units: {
      table: 'org_unit_workflow',
      to: 'org_unit'
    }
  }
}

const minimal = gql`
  fragment workflow_minimal on workflow {
    id
    name
  }
`
const fragments = {
  minimal,
  base: gql`
    fragment workflow_base on workflow {
      ...workflow_minimal
      stages(order_by: { name: asc }) {
        ...stage_base
      }
      org_units(order_by: { org_unit: { name: asc } }) {
        id
        org_unit {
          id
          name
        }
      }
    }
    ${minimal}
    ${stage.fragments.base}
  `
}

const queries = {
  form: gql`
    query workflow($where: workflow_bool_exp) {
      workflow(where: $where, order_by: [{ name: asc }]) {
        ...workflow_base
      }
    }
    ${fragments.base}
  `,
  option: gql`
    query workflow($where: workflow_bool_exp) {
      workflow(where: $where, order_by: [{ name: asc }]) {
        id
        name
      }
    }
  `
}

const mutations = {
  delete: gql`
    mutation delete_workflow($where: workflow_bool_exp!) {
      delete_workflow(where: $where) {
        affected_rows
      }
    }
  `,
  update: gql`
    mutation update_workflow($id: uuid!, $name: String) {
      result: update_workflow(
        where: { id: { _eq: $id } }
        _set: { name: $name }
      ) {
        returning {
          ...workflow_base
        }
      }
    }
    ${fragments.base}
  `,
  insert: gql`
    mutation insert_workflow($name: String) {
      result: insert_workflow(objects: [{ name: $name }]) {
        returning {
          ...workflow_base
        }
      }
    }
    ${fragments.base}
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
