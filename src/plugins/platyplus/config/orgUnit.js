import gql from 'graphql-tag'
import * as orgUnitType from '../metadata/orgUnitType'

export const settings = {
  orderBy: { name: 'asc' }
}

const minimal = gql`
  fragment org_unit_minimal on org_unit {
    id
    name
  }
`
export const fragments = {
  minimal,
  base: gql`
    fragment org_unit_base on org_unit {
      ...org_unit_minimal
      parent_id
      parent {
        ...org_unit_minimal
      }
      children(order_by: { name: asc }) {
        ...org_unit_minimal
      }
      type_id
      type {
        ...org_unit_type_minimal
      }
    }
    ${minimal}
    ${orgUnitType.fragments.minimal}
  `
}

export const queries = {}

export const mutations = {
  insert: gql`
    mutation insert_org_unit($objects: [org_unit_insert_input!]!) {
      insert_org_unit(objects: $objects) {
        returning {
          ...org_unit_base
        }
      }
    }
    ${fragments.base}
  `,
  // TODO: passer type.id et non type_id? Ainsi, enlever type_id des fragments.
  // Contrepartie: mettre type: {} dans initialValues
  update: gql`
    mutation update_org_unit(
      $id: ID!
      $name: String
      $type_id: ID
      $parent_id: ID
    ) {
      update_org_unit(
        where: { id: { _eq: $id } }
        _set: { name: $name, type_id: $type_id, parent_id: $parent_id }
      ) {
        affected_rows
        returning {
          ...org_unit_base
        }
      }
    }
    ${fragments.base}
  `
}
