import gql from 'graphql-tag'
import orgUnitType from './org_unit_type'
import workflow from './workflow'

const settings = {
  options: {
    parent: {
      table: 'org_unit',
      filter: (item, data, settings) => data.item.id !== item.id
    },
    type: {
      table: 'org_unit_type',
      /** Shows only the available types according to the parent's type, or all root types if no parents */
      filter: (item, data, settings) => {
        // TODO transpose this server-side, or at least secure the insert/update
        if (data.item.parent?.id) {
          return data.item.parent.type?.to?.some(i => item.id === i.to.id)
        } else {
          return item.from.length === 0
        }
      }
    },
    workflows: {
      table: 'workflow',
      where: {}
    }
  },
  relations: {
    workflows: {
      table: 'org_unit_workflow',
      to: 'workflow'
    }
  }
}

const minimal = gql`
  fragment org_unit_minimal on org_unit {
    id
    name
    type_id
    type {
      ...org_unit_type_base
    }
  }
  ${orgUnitType.fragments.base}
`
const base = gql`
  fragment org_unit_base on org_unit {
    ...org_unit_minimal
    parent_id
    parent {
      ...org_unit_minimal
    }
    # TODO number of levels are limited that way...
    children(order_by: { name: asc }) {
      ...org_unit_minimal
      children(order_by: { name: asc }) {
        ...org_unit_minimal
        children(order_by: { name: asc }) {
          ...org_unit_minimal
          children(order_by: { name: asc }) {
            ...org_unit_minimal
          }
        }
      }
    }
    role_attributions {
      id
      user {
        id
        username
      }
      role {
        id
        name
      }
    }
    workflows {
      id
      workflow {
        ...workflow_minimal
      }
    }
  }
  ${minimal}
  ${workflow.fragments.minimal}
`
const fragments = {
  minimal,
  base,
  full: gql`
    fragment org_unit_full on org_unit {
      ...org_unit_base
      isolated_encounter_types {
        id
        encounter_type {
          id
          name
        }
      }
    }
    ${base}
  `
}

const queries = {
  form: gql`
    query org_unit($where: org_unit_bool_exp) {
      org_unit(where: $where, order_by: { name: asc }) {
        ...org_unit_base
      }
    }
    ${fragments.base}
  `,
  option: gql`
    query org_unit($where: org_unit_bool_exp) {
      org_unit(where: $where, order_by: { name: asc }) {
        ...org_unit_minimal
      }
    }
    ${fragments.minimal}
  `
}

const mutations = {
  delete: gql`
    mutation delete_org_unit($where: org_unit_bool_exp!) {
      delete_org_unit(where: $where) {
        affected_rows
      }
    }
  `,
  insert: gql`
    mutation insert_org_unit(
      $name: String
      $type_id: uuid
      $parent_id: uuid
      $workflows_add: [org_unit_workflow_insert_input!]!
    ) {
      workflows_add: insert_org_unit_workflow(objects: $workflows_add) {
        affected_rows
      }
      result: insert_org_unit(
        objects: [{ name: $name, type_id: $type_id, parent_id: $parent_id }]
      ) {
        returning {
          ...org_unit_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_org_unit(
      $id: uuid!
      $name: String
      $type_id: uuid
      $parent_id: uuid
      $workflows_add: [org_unit_workflow_insert_input!]!
      $workflows_remove: [uuid]!
    ) {
      workflows_add: insert_org_unit_workflow(objects: $workflows_add) {
        affected_rows
      }
      workflows_remove: delete_org_unit_workflow(
        where: {
          _and: {
            workflow_id: { _in: $workflows_remove }
            org_unit_id: { _eq: $id }
          }
        }
      ) {
        affected_rows
      }
      result: update_org_unit(
        where: { id: { _eq: $id } }
        _set: { name: $name, type_id: $type_id, parent_id: $parent_id }
      ) {
        returning {
          ...org_unit_base
        }
      }
    }
    ${fragments.base}
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
