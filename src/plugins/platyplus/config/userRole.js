import gql from 'graphql-tag'

export const settings = {}

export const fragments = {
  minimal: gql`
    fragment user_role_minimal on user_role {
      id
    }
  `
}

export const queries = {}

export const mutations = {}
