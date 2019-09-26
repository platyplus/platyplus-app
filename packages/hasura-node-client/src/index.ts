import axios from 'axios'
import { GraphQLClient } from 'graphql-request'

const baseURL = `${process.env.GRAPHQL_ENGINE_URL ||
  process.env.GRAPHQL_ENGINE_PUBLIC_URL}/v1/graphql`
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET
let headers = {}
if (ADMIN_SECRET) {
  headers = {
    'X-Hasura-Admin-Secret': ADMIN_SECRET
  }
}

export const graphql = new GraphQLClient(baseURL, { headers })

export const rest = axios.create({ baseURL, headers })
