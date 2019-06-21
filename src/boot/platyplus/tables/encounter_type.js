import gql from 'graphql-tag'
import entityType from './entity_type'

const settings = {
  defaultValues: {
    encounter_schema: {}
  },
  options: {
    entity_type: {
      table: 'entity_type'
    },
    isolated_uses: {
      table: 'org_unit'
    }
  },
  relations: {
    isolated_uses: {
      table: 'org_unit_isolated_encounter_type',
      to: 'org_unit'
    }
  }
}

const minimal = gql`
  fragment encounter_type_minimal on encounter_type {
    id
    name
    title_create
  }
`

const fragments = {
  minimal,
  base: gql`
    fragment encounter_type_base on encounter_type {
      ...encounter_type_minimal
      encounter_schema
      entity_type_id
      entity_type {
        ...entity_type_minimal
      }
      actions {
        id
      }
      isolated_uses {
        id
        org_unit_id
        org_unit {
          id
          name
        }
      }
    }
    ${minimal}
    ${entityType.fragments.minimal}
  `
}

const queries = {
  form: gql`
    query encounter_type($where: encounter_type_bool_exp) {
      encounter_type(where: $where) {
        # TODO: default order to be hardcoded
        ...encounter_type_base
      }
    }
    ${fragments.base}
  `
}

const mutations = {
  delete: gql`
    mutation delete_encounter_type($where: encounter_type_bool_exp!) {
      delete_encounter_type(where: $where) {
        affected_rows
      }
    }
  `,
  /**
   * Creates a new encounter and a new entity, in a new state from the stage in params
   */
  insert: gql`
    mutation insert_encounter_type(
      $name: String
      $title_create: String
      $entity_type_id: uuid
      $isolated_uses_add: [org_unit_isolated_encounter_type_insert_input!]!
      $encounter_schema: jsonb
    ) {
      result: insert_encounter_type(
        objects: [
          {
            name: $name
            title_create: $title_create
            entity_type_id: $entity_type_id
            encounter_schema: $encounter_schema
            isolated_uses: { data: $isolated_uses_add }
          }
        ]
      ) {
        returning {
          ...encounter_type_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_encounter_type(
      $id: uuid!
      $isolated_uses_add: [org_unit_isolated_encounter_type_insert_input!]!
      $isolated_uses_remove: [uuid]!
      $encounter_schema: jsonb
      $name: String
      $title_create: String
      $entity_type_id: uuid
    ) {
      isolated_uses_add: insert_org_unit_isolated_encounter_type(
        objects: $isolated_uses_add
      ) {
        affected_rows
      }
      isolated_uses_remove: delete_org_unit_isolated_encounter_type(
        where: {
          _and: { org_unit_id: { _in: $isolated_uses_remove } }
          encounter_type_id: { _eq: $id }
        }
      ) {
        affected_rows
      }
      result: update_encounter_type(
        where: { id: { _eq: $id } }
        _set: {
          name: $name
          title_create: $title_create
          entity_type_id: $entity_type_id
          encounter_schema: $encounter_schema
        }
      ) {
        affected_rows
        returning {
          ...encounter_type_base
        }
      }
    }
    ${fragments.base}
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
