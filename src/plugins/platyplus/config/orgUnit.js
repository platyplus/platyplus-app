import gql from 'graphql-tag'
import * as orgUnitType from '../metadata/orgUnitType'

export const settings = {
  options: {
    parent: {
      table: 'org_unit',
      filter: (item, data, settings) => {
        return data.item.id !== item.id
      },
      map: item => ({
        value: item.id,
        label: item.name
      }) // TODO: put the basic transformation in the root settings of the table?
    },
    type: {
      table: 'org_unit_type',
      filter: (item, data, settings) => {
        // Shows only the available types according to the parent's type
        // TODO: transpose this server-side :D
        // TODO: what if we change the parent???
        if (data.item.parent) {
          if (data.item.parent.type) {
            if (data.item.parent.type.to) {
              return data.item.parent.type.to.some(i => item.id === i.to.id)
            } else return false
          } else return false
        } else return item.from.length === 0
      },
      map: item => ({
        value: item.id,
        label: item.name
      })
    }
  },
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
        type {
          ...org_unit_type_base
        }
      }
      children(order_by: { name: asc }) {
        ...org_unit_minimal
      }
      type_id
      type {
        ...org_unit_type_base
      }
    }
    ${minimal}
    ${orgUnitType.fragments.base}
  `
}

export const queries = {}

export const mutations = {
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
