import { ApolloServer } from 'apollo-server-koa'
import rasha, { Jwk } from 'rasha'

import microservice from '@platyplus/microservice'

import { resolvers } from './resolvers'
import { typeDefs } from './type-definitions'
import { PUBLIC_KEY, ALGORITHM, KID } from './config'

// TODO: if roles change, the JWT shoud be regenerated! How to do it in the most seamless way?
// We could invalidate it?
// https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens

const { router, app } = microservice()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: ({ req }) => ({
    ...req
  })
})

rasha
  .import({ pem: PUBLIC_KEY, public: true })
  .then((jwk: Jwk) => {
    const jwks = {
      keys: [
        {
          ...jwk,
          alg: ALGORITHM,
          use: 'sig',
          kid: KID
        }
      ]
    }
    router.get('/jwks', ctx => {
      // TODO rotation de jwks
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify(jwks, null, 2) + '\n'
    })
    server.applyMiddleware({ app })
    console.log(`GraphQL endpoint will be: ${server.graphqlPath}`)
  })
  .catch(() => {
    console.error('Invalid public key')
  })
