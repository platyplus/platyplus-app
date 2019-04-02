const { GraphQLClient } = require('graphql-request'),
  axios = require('axios')

const graphql = new GraphQLClient(
  `${process.env.HASURA_URL}/v1alpha1/graphql`,
  {
    headers: {
      'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
    }
  }
)

const rest = axios.create({
  baseURL: `${process.env.HASURA_URL}/v1/query`,
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  }
})

module.exports = { graphql, rest }
