const HASURA_URL = `${process.env.HASURA_URL}/v1/graphql`
const axios = require('axios')
const rest = axios.create({
  baseURL: HASURA_URL,
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  }
})
module.exports = rest
