const express = require('express'),
  { ApolloServer, gql } = require('apollo-server-express'),
  // { GraphQLClient } = require('graphql-request')
  // bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n'),
  // privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  algorithm = process.env.ALGORITHM || 'RS256'

// const graphql = new GraphQLClient(process.env.HASURA_URL, {
//   headers: {
//     'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
//   }
// })

const typeDefs = gql`
  type Query {
    currentCluster: Cluster!
  }
  type Mutation {
    testAdmin(username: String, password: String): TestPayload!
  }
  type TestPayload {
    id: ID
    token: String
  }
  type Cluster {
    id: ID
    name: String
  }
`

const resolvers = {
  Query: {
    currentCluster: async (_, args, req) => {
      const Authorization = req.headers.authorization
      if (Authorization) {
        // TODO: only for admins
        const token = Authorization.replace('Bearer ', '')
        const verifiedToken = jwt.verify(token, publicKey, {
          algorithms: [algorithm]
        })
        console.log(verifiedToken)
        return {
          id: 'TODO:',
          name: 'TODO:'
        }
      } else {
        throw new Error('Not logged in.')
      }
    }
  },
  Mutation: {
    testAdmin: async (_, { username, password }) => {
      const user = {}

      return { id: user.id }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: ({ req }) => ({
    ...req
  })
})

const app = express()
server.applyMiddleware({ app })

module.exports = app
