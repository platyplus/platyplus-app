const fs = require('fs')
const ADMIN_SECRET =
  process.env.HASURA_ACCESS_KEY || fs.readFileSync('secret.key', 'utf-8') //, (_, data) => data)
const HASURA_URL =
  process.env.HASURA_URL || 'http://graphql.localhost/v1alpha1/graphql'
module.exports = {
  client: {
    service: {
      name: 'graphql-gateway',
      url: HASURA_URL, // TODO: don't forget to add an entry to /etc/hosts if the API_URL redirects to localhost!
      headers: {
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      skipSSLValidation: true
    }
  }
}
