const { ApolloServer, gql } = require('apollo-server')
const { GraphQLClient } = require('graphql-request')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtKey = process.env.AUTH_PRIVATE_KEY.replace(/\\n/g, '\n')

const graphql = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
  }
})

const LOGIN = gql`
  query user($email: String) {
    user(where: { email: { _eq: $email } }) {
      id
      password
    }
  }
`

const SIGNUP = gql`
  mutation signup($email: String, $password: String) {
    insert_user(objects: [{ email: $email, password: $password }]) {
      returning {
        id
      }
    }
  }
`

const ME = gql`
  query me($id: uuid) {
    user(where: { id: { _eq: $id } }) {
      email
    }
  }
`

const typeDefs = gql`
  type Query {
    me: User!
  }
  type Mutation {
    signup(email: String, password: String): AuthPayload!
    login(email: String, password: String): AuthPayload!
  }
  type AuthPayload {
    token: String
  }
  type User {
    email: String
  }
`

const resolvers = {
  Query: {
    me: async (_, args, req) => {
      const Authorization = req.headers.authorization
      if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const verifiedToken = jwt.verify(token, jwtKey)
        const user = await graphql
          .request(ME, { id: verifiedToken.userId })
          .then(data => {
            return data.user[0]
          })
        return { ...user }
      } else {
        throw new Error('Not logged in.')
      }
    }
  },
  Mutation: {
    signup: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await graphql
        .request(SIGNUP, { email, password: hashedPassword })
        .then(data => {
          return data.insert_user.returning[0]
        })

      const token = jwt.sign(
        {
          userId: user.id,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': user.id
          }
        },
        jwtKey
      )

      return { token }
    },
    login: async (_, { email, password }) => {
      const user = await graphql.request(LOGIN, { email }).then(data => {
        return data.user[0]
      })

      if (!user) throw new Error('No such user found.')

      const valid = await bcrypt.compare(password, user.password)

      if (valid) {
        const token = jwt.sign(
          {
            userId: user.id,
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': ['user'],
              'x-hasura-default-role': 'user',
              'x-hasura-user-id': user.id
            }
          },
          jwtKey
        )

        return { token }
      } else {
        throw new Error('Invalid password.')
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    ...req
  })
})

server.listen({ port: process.env.port || 8080 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
