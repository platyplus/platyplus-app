import gql from 'graphql-tag'

export const settings = {
  options: {
    user: {
      table: 'user',
      where: {},
      map: item => ({
        value: item.id,
        label: item.username
      })
    },
    role: {
      table: 'role',
      where: {},
      map: item => ({
        value: item.id,
        label: item.name
      })
    },
    org_unit: {
      table: 'org_unit',
      where: {},
      map: item => ({
        value: item.id,
        label: item.name
      })
    }
  }
}

const minimal = gql`
  fragment role_attribution_minimal on role_attribution {
    id
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment role_attribution_base on role_attribution {
      ...role_attribution_minimal
      role_id
      role {
        id
        name
      }
      user_id
      user {
        id
        username
      }
      org_unit_id
      org_unit {
        id
        name
      }
    }
    ${minimal}
  `
}

export const queries = {
  form: gql`
    query role_attribution($where: role_attribution_bool_exp) {
      role_attribution(where: $where, order_by: [{ role: { name: asc } }]) {
        ...role_attribution_base
      }
    }
    ${fragments.base}
  `
}

export const mutations = {
  delete: gql`
    mutation delete_role_attribution($where: role_attribution_bool_exp!) {
      delete_role_attribution(where: $where) {
        affected_rows
      }
    }
  `,
  insert: gql`
    mutation insert_role_attribution(
      $user_id: uuid
      $role_id: uuid
      $org_unit_id: uuid
    ) {
      result: insert_role_attribution(
        objects: [
          { user_id: $user_id, role_id: $role_id, org_unit_id: $org_unit_id }
        ]
      ) {
        returning {
          ...role_attribution_base
        }
      }
    }
    ${fragments.base}
  `
}
