import axios from 'axios'
import { GraphQLClient } from 'graphql-request'

const HASURA_URL = `${process.env.HASURA_URL}/v1/graphql`
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET
let headers = {}
if (ADMIN_SECRET) {
  headers = {
    'X-Hasura-Admin-Secret': ADMIN_SECRET
  }
}

export const graphql = new GraphQLClient(HASURA_URL, { headers })

export const rest = axios.create({ baseURL: HASURA_URL, headers })
