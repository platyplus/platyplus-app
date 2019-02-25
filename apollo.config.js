const fs = require('fs')
const ADMIN_SECRET =
  process.env.HASURA_ACCESS_KEY || fs.readFileSync('secret.key', 'utf-8') //, (_, data) => data)
module.exports = {
  client: {
    service: {
      name: 'hasura-graphql-engine',
      url: 'http://graphql.localhost/v1alpha1/graphql',
      headers: {
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      skipSSLValidation: true
    }
  }
}
