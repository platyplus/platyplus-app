const { ApolloServer, gql } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')
// const { printSchema } = require('graphql/utilities')
const {
  introspectSchema,
  mergeSchemas,
  transformSchema,
  FilterRootFields
} = require('graphql-tools')
const { ApolloClient } = require('apollo-client')
const { InMemoryCache } = require('apollo-cache-inmemory')

const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const algorithm = process.env.ALGORITHM

const LOGIN = `
  query user($username: String) {
    user(where: { username: { _eq: $username } }) {
      id
      password
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

const link = new HttpLink({
  uri: process.env.HASURA_URL,
  fetch,
  headers: {
    'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
  }
})

const graphql = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

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

      return { token }
    },
    login: async (_, { username, password }) => {
      const user = await graphql
        .request(LOGIN, { username })
        .then(data => data.user[0])

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
          privateKey,
          { algorithm }
        )
        return { token }
      } else {
        throw new Error('Invalid password.')
      }
    }
  }
}

const extendSchema = async () => {
  const typeExtensions = gql`
    type Query {
      me: User!
    }
    type Mutation {
      signup(username: String, password: String): AuthPayload!
      login(username: String, password: String): AuthPayload!
    }
    type AuthPayload {
      token: String
    }
  `
  const initialSchema = await introspectSchema(link)

  const newSchema = mergeSchemas({
    schemas: [
      transformSchema(initialSchema, [
        new FilterRootFields(operation => false)
      ]),
      typeExtensions
    ],
    resolvers
  })
  return newSchema
}

const startServer = async () => {
  const schema = await extendSchema()
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      ...req
    })
  })
  // const server = new ApolloServer({
  //   typeDefs,
  //   resolvers,
  //   schema
  //   context: ({ req }) => ({
  //     ...req
  //   })
  // })

  server.listen({ port: process.env.port || 8080 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
}

try {
  startServer()
} catch (e) {
  console.error(e)
}
