const express = require('express'),
  { ApolloServer, gql } = require('apollo-server-express'),
  jwt = require('jsonwebtoken'),
  PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')

const decodeJwt = req => {
  const Authorization = req.headers.authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    return jwt.verify(token, PUBLIC_KEY, {
      algorithms: [process.env.ALGORITHM || 'RS256']
    })
  } else return null
}

// { GraphQLClient } = require('graphql-request')

// const graphql = new GraphQLClient(process.env.HASURA_URL, {
//   headers: {
//     'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
//   }
// })

// const LOGIN = gql`
//   query user($username: String) {
//     user(where: { username: { _eq: $username } }) {
//       id
//       password
//       roles {
//         role {
//           name
//         }
//       }
//     }
//   }
// `

// const SIGNUP = gql`
//   mutation signup($username: String, $password: String) {
//     insert_user(objects: [{ username: $username, password: $password }]) {
//       returning {
//         id
//       }
//     }
//   }
// `

const typeDefs = gql`
  type Query {
    dummy: String!
  }
  type Mutation {
    importXlsForms(file: Upload!): ImportPayload!
  }
  type ImportPayload {
    status: String!
    message: String!
  }
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`
const streamToString = stream =>
  new Promise((resolve, reject) => {
    let data = ''
    stream
      .on('error', reject)
      .on('data', chunk => {
        data += chunk
      })
      .on('end', () => resolve(data))
  })

const resolvers = {
  Query: {
    dummy: async (_, args, req) => {
      return 'dummyQuery'
    }
  },
  Mutation: {
    importXlsForms: async (_, { file }, req) => {
      const token = decodeJwt(req)
      if (token) {
        console.log('token')
      }
      const { stream, filename, mimetype, encoding } = await file
      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      let string = await streamToString(stream)
      console.log(string)
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )
      return { filename, mimetype, encoding }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: ({ req }) => ({
    ...req
  }),
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20
  }
})

const app = express()
// app.use(bodyParser.json())
// // TODO: what happens in production mode?
// if (process.env.NODE_ENV === 'development') {
//   console.log('Allow CORS in dev mode')
//   app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     )
//     next()
//   })
// }

// TODO: Stop exposing functions once HGE allows to upload files
//  See https://github.com/hasura/graphql-engine/issues/1326
// app.post('/importXlsForms', function (req, res, next) {
//   const token = decodeJwt(req)
//   console.log(token)
//   res.setHeader('Content-Type', 'application/json')
//   res.send(JSON.stringify({ tada: 'ok' }, null, 2) + '\n')
// })

server.applyMiddleware({ app })
console.log(`GraphQL endpoint will be: ${server.graphqlPath}`)

module.exports = app
