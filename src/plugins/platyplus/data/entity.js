import gql from 'graphql-tag'

export const settings = {
  defaultValues: {
    attributes: {}
  }
}

const minimal = gql`
  fragment entity_minimal on entity {
    id
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment entity_base on entity {
      ...entity_minimal
      attributes
    }
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_entity($id: ID!, $attributes: jsonb) {
      update_entity(
        where: { id: { _eq: $id } }
        _set: { attributes: $attributes }
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
