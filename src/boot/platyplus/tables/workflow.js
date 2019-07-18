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
    mutation update_workflow(
      $id: uuid!
      $name: String
      $org_units_add: [org_unit_workflow_insert_input!]!
      $org_units_remove: [uuid!]!
    ) {
      org_units_add: insert_org_unit_workflow(objects: $org_units_add) {
        affected_rows
      }
      org_units_remove: delete_org_unit_workflow(
        where: {
          _and: {
            org_unit_id: { _in: $org_units_remove }
            workflow_id: { _eq: $id }
          }
        }
      ) {
        affected_rows
      }
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
    mutation insert_workflow(
      $name: String
      $org_units_add: [org_unit_workflow_insert_input!]!
    ) {
      result: insert_workflow(
        objects: [{ name: $name, org_units: { data: $org_units_add } }]
      ) {
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
