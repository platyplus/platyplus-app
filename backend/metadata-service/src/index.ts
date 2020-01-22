import 'reflect-metadata'
import * as path from 'path'
import { ApolloServer } from 'apollo-server-koa'
import jwksRsa from 'jwks-rsa'
import jwt from 'koa-jwt'
import { buildSchema, BuildSchemaOptions } from 'type-graphql'

import microservice from '@platyplus/microservice'

import { JWKS_URL } from './config'
import { TableResolver } from './table-resolver'
import generateSchema from './database-sync'

const { app } = microservice()

// ? If platyplus uses more than remote schema microservice, then create a remote-schema-service package from the microservice package with the following JWT/auth middleware.
app.use(
  jwt({
    secret: jwksRsa.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri: JWKS_URL
    }),
    // audience,
    // debug: true,
    // issuer: process.env.AUTHENTICATION_URL, // ? https://jwt.io/introduction/ -> set 'iss' in the authentication-service
    algorithms: ['RS256'],
    passthrough: true
  })
)

async function bootstrap() {
  await generateSchema()
  // build TypeGraphQL executable schema
  const buildOptions: BuildSchemaOptions = {
    resolvers: [TableResolver]
  }
  // automatically create 'schema.gql' file with schema definition in current folder
  if (process.env.NODE_ENV === 'development')
    buildOptions.emitSchemaFile = path.resolve(__dirname, 'schema.graphql')
  const schema = await buildSchema(buildOptions)

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: ({
      ctx: {
        state: { user }
      }
    }) => ({ user })
  })

  server.applyMiddleware({ app })

  console.info(`GraphQL endpoint will be: ${server.graphqlPath}`)
}

bootstrap()
