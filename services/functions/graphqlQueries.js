const gql = require('graphql-tag'),
  { print } = require('graphql/language/printer')

exports.ENTITY_TYPE_SCHEMA_FROM_ENTITY = print(gql`
  query entityTypeSchema($id: uuid!) {
    entity(where: { id: { _eq: $id } }) {
      type {
        schema
      }
    }
  }
`)

exports.UPDATE_ENTITY_ATTRIBUTES = print(gql`
  mutation updateEntityData($id: uuid!, $attributes: jsonb!) {
    update_entity(
      where: { id: { _eq: $id } }
      _set: { attributes: $attributes }
    ) {
      affected_rows
    }
  }
`)
