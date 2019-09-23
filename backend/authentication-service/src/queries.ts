import { gql } from 'apollo-server-koa'

export const LOGIN = gql`
  query login($username: String) {
    user(where: { username: { _eq: $username } }) {
      id
      password
      roles {
        role {
          name
        }
      }
    }
  }
`

export const SIGNUP = gql`
  mutation signup($username: String, $password: String) {
    insert_user(objects: [{ username: $username, password: $password }]) {
      returning {
        id
      }
    }
  }
`

export const ME = gql`
  query me($id: uuid) {
    user(where: { id: { _eq: $id } }) {
      id
      username
    }
  }
`
