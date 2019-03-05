const fs = require('fs')
const ADMIN_SECRET =
  process.env.HASURA_ACCESS_KEY || fs.readFileSync('secret.key', 'utf-8') //, (_, data) => data)
const API_URL = process.env.API_URL || 'http://api.localhost'
module.exports = {
  client: {
    service: {
      name: 'graphql-gateway',
      url: API_URL, // TODO: don't forget to add an entry to /etc/hosts if the API_URL redirects to localhost!
      headers: {
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      skipSSLValidation: true
    }
  }
}
