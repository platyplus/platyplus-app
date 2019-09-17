import { gql } from 'apollo-server-koa'

export const typeDefs = gql`
  type Query {
    me: User!
  }
  type Mutation {
    signup(username: String, password: String): AuthPayload!
    login(username: String, password: String): AuthPayload!
  }
  type AuthPayload {
    id: ID
    token: String
  }
  type User {
    id: ID
    username: String
  }
`
