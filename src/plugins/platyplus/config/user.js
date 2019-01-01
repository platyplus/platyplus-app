import gql from 'graphql-tag'
import * as orgUnit from './orgUnit'

export const settings = {
  defaultValues: {
    attributes: {}
  },
  validations: {
    attributes: {
      first_name: {
        required: true,
        min: 2
      },
      last_name: {
        required: true,
        min: 2
      }
    }
  },
  options: {
    org_unit_memberships: {
      table: 'org_unit',
      where: {},
      map: item => ({
        value: item.id,
        label: item.name
      })
    }
  },
  relations: {
    org_unit_memberships: {
      table: 'user_org_unit',
      to: 'org_unit'
    }
  },
  beforeSave: ({ newValues, initial, relations }) => {
    if (
      // TODO: make generic in the form preSave? Or through a validation rule?
      !newValues.org_unit_memberships
        .map(item => item.org_unit.id)
        .includes(newValues.preferred_org_unit_id)
    ) {
      newValues.preferred_org_unit_id = null
    }
    return { newValues }
  }
}

export const fragments = {
  full: gql`
    fragment user_full on user {
      id
      username
      attributes
      created_at
      preferred_org_unit_id
      preferred_org_unit {
        ...org_unit_minimal
      }
      org_unit_memberships {
        id
        org_unit {
          ...org_unit_minimal
        }
      }
    }
    ${orgUnit.fragments.minimal}
  `
}

export const queries = {}

export const mutations = {
  update: gql`
    mutation update_user(
      $id: ID!
      $attributes: jsonb
      $preferred_org_unit_id: ID
    ) {
      update_user(
        where: { id: { _eq: $id } }
        _append: { attributes: $attributes }
        _set: { preferred_org_unit_id: $preferred_org_unit_id }
      ) {
        affected_rows
        returning {
          ...user_full
        }
      }
    }
    ${fragments.full}
  `,
  // TODO: test the above mutation
  insert: gql`
    mutation insert_user(
      $attributes: jsonb
      $username: String!
      $preferred_org_unit_id: ID
    ) {
      insert_user(
        objects: [
          {
            username: $username
            attributes: $attributes
            preferred_org_unit_id: $preferred_org_unit_id
          }
        ]
      ) {
        affected_rows
        returning {
          ...user_full
        }
      }
    }
    ${fragments.full}
  `
}
