const express = require('express'),
  { GraphQLClient } = require('graphql-request')

const graphql = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
  }
})

console.log(graphql) // TODO: remove

const app = express()

module.exports = app
