import gql from 'graphql-tag'

const settings = {
  options: {
    from: {
      table: 'org_unit_type'
    },
    to: {
      table: 'org_unit_type'
    }
  },
  relations: {
    from: {
      table: 'org_unit_type_mapping',
      from: 'to',
      to: 'from'
    },
    to: {
      table: 'org_unit_type_mapping',
      from: 'from',
      to: 'to'
    }
  }
}

const minimal = gql`
  fragment org_unit_type_minimal on org_unit_type {
    id
    name
  }
`

const fragments = {
  minimal,
  base: gql`
    fragment org_unit_type_base on org_unit_type {
      ...org_unit_type_minimal
      from {
        from {
          ...org_unit_type_minimal
        }
      }
      to {
        to {
          ...org_unit_type_minimal
        }
      }
    }
    ${minimal}
  `
}

const queries = {
  form: gql`
    query org_unit_type($where: org_unit_type_bool_exp) {
      org_unit_type(where: $where) {
        # TODO: default order to be hardcoded
        ...org_unit_type_base
      }
    }
    ${fragments.base}
  `,
  option: gql`
    query org_unit_type($where: org_unit_type_bool_exp) {
      org_unit_type(where: $where) {
        # TODO: default order to be hardcoded
        id
        name
        from {
          from {
            id
          }
        }
      }
    }
  `
}

const mutations = {
  delete: gql`
    mutation delete_org_unit_type($where: org_unit_type_bool_exp!) {
      delete_org_unit_type(where: $where) {
        affected_rows
      }
    }
  `,
  insert: gql`
    mutation insert_org_unit_type(
      $name: String
      $from_add: [org_unit_type_mapping_insert_input!]!
      $to_add: [org_unit_type_mapping_insert_input!]!
    ) {
      result: insert_org_unit_type(
        objects: [
          { name: $name, from: { data: $from_add }, to: { data: $to_add } }
        ]
      ) {
        returning {
          ...org_unit_type_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_org_unit_type(
      $id: uuid!
      $name: String
      $from_add: [org_unit_type_mapping_insert_input!]!
      $from_remove: [uuid]!
      $to_add: [org_unit_type_mapping_insert_input!]!
      $to_remove: [uuid]!
    ) {
      from_add: insert_org_unit_type_mapping(objects: $from_add) {
        affected_rows
      }
      from_remove: delete_org_unit_type_mapping(
        where: { _and: { from_id: { _in: $from_remove }, to_id: { _eq: $id } } }
      ) {
        affected_rows
      }
      to_add: insert_org_unit_type_mapping(objects: $to_add) {
        affected_rows
      }
      to_remove: delete_org_unit_type_mapping(
        where: { _and: { to_id: { _in: $to_remove }, from_id: { _eq: $id } } }
      ) {
        affected_rows
      }
      result: update_org_unit_type(
        where: { id: { _eq: $id } }
        _set: { name: $name }
      ) {
        affected_rows
        returning {
          ...org_unit_type_base
        }
      }
    }
    ${fragments.base}
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
