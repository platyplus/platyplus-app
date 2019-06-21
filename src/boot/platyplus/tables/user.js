import gql from 'graphql-tag'
import orgUnit from './org_unit'

const settings = {
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
    },
    roles: {
      table: 'role',
      where: { global: { _eq: true } },
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
    },
    roles: {
      table: 'user_role',
      to: 'role'
    }
  },
  beforeSave: ({ newValues, initial, relations }) => {
    if (
      // TODO: make generic in the form preSave? Or through a validation rule?
      newValues.org_unit_memberships &&
      !newValues.org_unit_memberships
        .map(item => item.org_unit.id)
        .includes(newValues.preferred_org_unit_id)
    ) {
      newValues.preferred_org_unit_id = null
    }
    return { newValues }
  }
}

const minimal = gql`
  fragment user_minimal on user {
    id
    username
  }
`

const base = gql`
  fragment user_base on user {
    ...user_minimal
    roles {
      id
      role {
        id
      }
    }
    role_attributions {
      id
      role {
        id
        name
      }
      org_unit {
        id
        name
      }
    }
    attributes
    locale
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
  ${minimal}
`

const fragments = {
  minimal,
  base,
  full: gql`
    fragment user_full on user {
      ...user_base
      created_at
      preferred_org_unit {
        ...org_unit_full
      }
    }
    ${orgUnit.fragments.full}
    ${base}
  `
}

const queries = {
  form: gql`
    query user($where: user_bool_exp) {
      user(where: $where, order_by: [{ username: asc }]) {
        ...user_base
      }
    }
    ${fragments.base}
  `,
  profile: gql`
    query user_profile($userId: uuid) {
      token @client {
        id @export(as: "userId")
      }
      user(where: { id: { _eq: $userId } }) {
        ...user_full
      }
    }
    ${fragments.full}
  `,
  option: gql`
    query user_option($where: user_bool_exp) {
      result: user(where: $where, order_by: [{ username: asc }]) {
        id
        username
      }
    }
  `
}

const mutations = {
  delete: gql`
    mutation delete_user($where: user_bool_exp!) {
      delete_user(where: $where) {
        affected_rows
      }
    }
  `,
  update_profile: gql`
    mutation update_profile(
      $id: uuid!
      $attributes: jsonb
      $preferred_org_unit_id: uuid
      $locale: String
    ) {
      result: update_user(
        where: { id: { _eq: $id } }
        _append: { attributes: $attributes }
        _set: { preferred_org_unit_id: $preferred_org_unit_id, locale: $locale }
      ) {
        affected_rows
        returning {
          ...user_full
        }
      }
    }
    ${fragments.full}
  `,
  update: gql`
    mutation update_user(
      $id: uuid!
      $username: String
      $org_unit_memberships_add: [user_org_unit_insert_input!]!
      $org_unit_memberships_remove: [uuid]!
      $roles_add: [user_role_insert_input!]!
      $roles_remove: [uuid]!
      $preferred_org_unit_id: uuid
      $locale: String
    ) {
      org_unit_memberships_add: insert_user_org_unit(
        objects: $org_unit_memberships_add
      ) {
        affected_rows
      }
      org_unit_memberships_remove: delete_user_org_unit(
        where: {
          _and: { org_unit_id: { _in: $org_unit_memberships_remove } }
          user_id: { _eq: $id }
        }
      ) {
        affected_rows
      }
      roles_add: insert_user_role(objects: $roles_add) {
        affected_rows
      }
      roles_remove: delete_user_role(
        where: {
          _and: { role_id: { _in: $roles_remove }, user_id: { _eq: $id } }
        }
      ) {
        affected_rows
      }
      result: update_user(
        where: { id: { _eq: $id } }
        _set: {
          preferred_org_unit_id: $preferred_org_unit_id
          username: $username
          locale: $locale
        }
      ) {
        affected_rows
        returning {
          ...user_full
        }
      }
    }
    ${fragments.full}
  `,
  insert: gql`
    mutation insert_user(
      $username: String
      $attributes: jsonb
      $preferred_org_unit_id: uuid
      $locale: String
    ) {
      result: insert_user(
        objects: [
          {
            username: $username
            attributes: $attributes
            preferred_org_unit_id: $preferred_org_unit_id
            locale: $locale
          }
        ]
      ) {
        returning {
          ...user_base
        }
      }
    }
    ${fragments.base}
  `,
  update_preferred_org_unit: gql`
    mutation update_preferred_org_unit(
      $id: uuid!
      $preferred_org_unit_id: uuid
    ) {
      result: update_user(
        where: { id: { _eq: $id } }
        _set: { preferred_org_unit_id: $preferred_org_unit_id }
      ) {
        affected_rows
        returning {
          ...user_full
        }
      }
    }
    ${fragments.full}
  `
  // TODO: test the above mutation
  // insert: gql`
  //   mutation insert_user(
  //     $attributes: jsonb
  //     $username: String!
  //     $preferred_org_unit_id: ID
  //   ) {
  //     insert_user(
  //       objects: [
  //         {
  //           username: $username
  //           attributes: $attributes
  //           preferred_org_unit_id: $preferred_org_unit_id
  //         }
  //       ]
  //     ) {
  //       affected_rows
  //       returning {
  //         ...user_full
  //       }
  //     }
  //   }
  //   ${fragments.full}
  // `
}

const resolvers = {}

export default { settings, fragments, queries, mutations, resolvers }
