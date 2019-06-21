import gql from 'graphql-tag'

export const settings = {
  options: {
    workflow: {
      table: 'workflow',
      filter: (item, data, settings) => data.item.id !== item.id
    },
    previous: {
      table: 'stage',
      filter: (item, data, settings) =>
        item.workflow_id === data.item.workflow_id
    },
    next: {
      table: 'stage',
      filter: (item, data, settings) =>
        item.workflow_id === data.item.workflow_id
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
  }
}

const minimal = gql`
  fragment stage_minimal on stage {
    id
    name
    workflow_id
  }
`
export const fragments = {
  minimal,
  base: gql`
    fragment stage_base on stage {
      ...stage_minimal
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
  `
}

export const queries = {
  option: gql`
    query stage_options($where: stage_bool_exp) {
      stage(where: $where) {
        # TODO: default order to be hardcoded
        ...stage_minimal
      }
    }
    ${fragments.minimal}
  `,
  form: gql`
    query stage($where: stage_bool_exp) {
      stage(where: $where) {
        ...stage_base
      }
    }
    ${fragments.base}
  `
}

export const mutations = {
  delete: gql`
    mutation delete_stage($where: stage_bool_exp!) {
      delete_stage(where: $where) {
        affected_rows
      }
    }
  `,
  insert: gql`
    mutation insert_stage(
      $name: String
      $workflow_id: uuid
      $previous_add: [stage_transition_insert_input!]!
      $next_add: [stage_transition_insert_input!]!
    ) {
      result: insert_stage(
        objects: [
          {
            name: $name
            workflow_id: $workflow_id
            previous: { data: $previous_add }
            next: { data: $next_add }
          }
        ]
      ) {
        returning {
          ...stage_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_stage(
      $id: uuid!
      $name: String
      $workflow_id: uuid
      $previous_add: [stage_transition_insert_input!]!
      $previous_remove: [uuid]!
      $next_add: [stage_transition_insert_input!]!
      $next_remove: [uuid]!
    ) {
      previous_add: insert_stage_transition(objects: $previous_add) {
        affected_rows
      }
      previous_remove: delete_stage_transition(
        where: {
          _and: {
            next_id: { _in: $previous_remove }
            previous_id: { _eq: $id }
          }
        }
      ) {
        affected_rows
      }
      next_add: insert_stage_transition(objects: $next_add) {
        affected_rows
      }
      next_remove: delete_stage_transition(
        where: {
          _and: {
            previous_id: { _in: $previous_remove }
            next_id: { _eq: $id }
          }
        }
      ) {
        affected_rows
      }
      result: update_stage(
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

export const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
