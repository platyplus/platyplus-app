/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
require('dotenv').config()
const ADMIN_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET ||
  fs.readFileSync('secret.key', 'utf-8') //, (_, data) => data)
const GRAPHQL_ENGINE_PUBLIC_URL =
  process.env.GRAPHQL_ENGINE_PUBLIC_URL || 'http://graphql.localhost'
const URL = `${GRAPHQL_ENGINE_PUBLIC_URL}/v1/graphql`
module.exports = {
  client: {
    service: {
      name: 'graphql-gateway',
      url: URL, // ! don't forget to add an entry to /etc/hosts if the API_URL redirects to localhost!
      headers: {
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      skipSSLValidation: true
    },
    excludes: ['node_modules/**/*'],
    includes: ['./src/**/*.{ts,gql,tsx,js,jsx,graphql,vue}']
  }
}
