const HASURA_URL = `${process.env.HASURA_URL}/v1/graphql`
const { GraphQLClient } = require('graphql-request')
const graphql = new GraphQLClient(HASURA_URL, {
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  }
})
module.exports = graphql
