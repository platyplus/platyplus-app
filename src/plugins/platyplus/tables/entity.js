import gql from 'graphql-tag'

const settings = {
  defaultValues: {
    attributes: {}
  }
}

const minimal = gql`
  fragment entity_minimal on entity {
    id
  }
`

const fragments = {
  minimal,
  base: gql`
    fragment entity_base on entity {
      ...entity_minimal
      attributes
    }
    ${minimal}
  `
}

const queries = {}

const mutations = {
  delete: gql`
    mutation delete_entity($where: entity_bool_exp!) {
      delete_entity(where: $where) {
        affected_rows
      }
    }
  `,
  update: gql`
    mutation update_entity($id: uuid!, $attributes: jsonb) {
      update_entity(
        where: { id: { _eq: $id } }
        _append: { attributes: $attributes }
      ) {
        affected_rows
        returning {
          ...entity_base
        }
      }
    }
    ${fragments.base}
  `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
