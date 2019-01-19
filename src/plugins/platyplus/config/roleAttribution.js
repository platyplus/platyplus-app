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

export const queries = {}

export const mutations = {}
