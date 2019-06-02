const express = require('express'), // TODO: KOA!
  // rsaPemToJwk = require('rsa-pem-to-jwk'),
  { ApolloServer, gql } = require('apollo-server-express'),
  { GraphQLClient } = require('graphql-request'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  rasha = require('rasha'),
  PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n'),
  PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  ALGORITHM = process.env.ALGORITHM || 'RS256'

// TODO: if roles change, the JWT shoud be regerated! How to do it in the most seamless way?
// We could invalidate it?
// https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens

const graphql = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  }
})

const LOGIN = `
  query user($username: String) {
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

const SIGNUP = `
  mutation signup($username: String, $password: String) {
    insert_user(objects: [{ username: $username, password: $password }]) {
      returning {
        id
      }
    }
  }
`

const ME = `
  query me($id: uuid) {
    user(where: { id: { _eq: $id } }) {
      id
      username
    }
  }
`

const typeDefs = gql`
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

const resolvers = {
  Query: {
    me: async (_, args, req) => {
      const Authorization = req.headers.authorization
      if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const verifiedToken = jwt.verify(token, PUBLIC_KEY, {
          algorithms: [ALGORITHM]
        })
        const user = await graphql
          .request(ME, { id: verifiedToken.userId })
          .then(data => data.user[0])
        return { ...user }
      } else {
        throw new Error('Not logged in.')
      }
    }
  },
  Mutation: {
    // TODO: secure the endpoint!!!
    signup: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await graphql
        .request(SIGNUP, { username, password: hashedPassword })
        .then(data => data.insert_user.returning[0])

      const token = jwt.sign(
        {
          userId: user.id,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': user.id
          }
        },
        PRIVATE_KEY,
        { algorithm: ALGORITHM }
      )

      return { id: user.id, token }
    },
    // TODO: test if active user
    login: async (_, { username, password }) => {
      const user = await graphql
        .request(LOGIN, { username })
        .then(data => data.user[0])

      if (!user) throw new Error('No such user found.')

      const valid = await bcrypt.compare(password, user.password)

      if (valid) {
        const roles = user.roles.map(node => node.role.name).concat('user')
        const token = jwt.sign(
          {
            userId: user.id,
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': roles,
              'x-hasura-default-role': 'admin', // TODO: return highest role level
              'x-hasura-user-id': user.id
            }
          },
          PRIVATE_KEY,
          { algorithm: ALGORITHM }
        )
        return { id: user.id, token }
      } else {
        throw new Error('Invalid password.')
      }
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

app.get('/jwks', function (req, res, next) {
  const jwk = {
    ...rasha.importSync({ pem: PUBLIC_KEY }),
    alg: ALGORITHM,
    use: 'sig',
    kid: '97fcbca368fe77808830c8100121ec7bde22cf0e'
  }
  const jwks = {
    keys: [jwk]
  }
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(jwks, null, 2) + '\n')
})

server.applyMiddleware({ app })
console.log(`GraphQL endpoint will be: ${server.graphqlPath}`)

module.exports = app
