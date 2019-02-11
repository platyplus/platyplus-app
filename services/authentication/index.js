const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { GraphQLClient } = require('graphql-request')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const algorithm = process.env.ALGORITHM

const graphql = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
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
        const verifiedToken = jwt.verify(token, publicKey, {
          algorithms: [algorithm]
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
        privateKey,
        { algorithm }
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
              'x-hasura-default-role': 'user',
              'x-hasura-user-id': user.id
            }
          },
          privateKey,
          { algorithm }
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
server.applyMiddleware({ path: '/', app })
console.log(`GraphQL endpoint will be: ${server.graphqlPath}`)

app.get('/healthz', function (req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n')
})

module.exports = app
