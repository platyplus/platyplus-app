const express = require('express'),
  { ApolloServer, gql } = require('apollo-server-express'),
  jwt = require('jsonwebtoken'),
  path = require('path'),
  fs = require('fs'),
  yaml = require('js-yaml'),
  // { GraphQLClient } = require('graphql-request')
  PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n'),
  ALGORITHM = process.env.ALGORITHM || 'RS256',
  CONFIG_DIR = '/opt/git-sync/configuration',
  CLUSTER_CONFIG_FILE = 'cluster.yml'

// const graphql = new GraphQLClient(process.env.HASURA_URL, {
//   headers: {
//     'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
//   }
// })

const getClusterConfig = () => {
  try {
    return yaml.safeLoad(
      fs.readFileSync(path.join(CONFIG_DIR, CLUSTER_CONFIG_FILE), 'utf8')
    )
  } catch (err) {
    throw err
  }
}

console.log(getClusterConfig())

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
        const token = Authorization.replace('Bearer ', '')
        const verifiedToken = jwt.verify(token, PUBLIC_KEY, {
          algorithms: [ALGORITHM]
        })
        console.log(verifiedToken)
        const claims = verifiedToken['https://hasura.io/jwt/claims']
        const roles = claims['x-hasura-allowed-roles']
        console.log(roles)
        if (roles.includes('admin')) {
          console.log('TODO: admin')
          return {
            id: 'TODO:',
            name: 'TODO:'
          }
        } else throw new Error('Not an admin.')
      } else throw new Error('Not logged in.')
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
