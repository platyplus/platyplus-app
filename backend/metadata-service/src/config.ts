import { Context } from 'koa'

export const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:@postgres:5432/postgres'

export const UNAUTHORIZED_ROLE =
  process.env.HASURA_GRAPHQL_UNAUTHORIZED_ROLE || 'anonymous'

export const HASURA_CLAIMS =
  process.env.HASURA_CLAIMS || 'https://hasura.io/jwt/claims'

const AUTHENTICATION_URL =
  process.env.AUTHENTICATION_URL || 'http://authentication:3000'

export const JWKS_URL = `${AUTHENTICATION_URL}/jwks`

// * Schema being used to install the required tables/views/triggers for handling metadata
export const DATABASE_SCHEMA = 'platyplus'

export const getClaims = (context: Context) =>
  context.user && context.user[HASURA_CLAIMS]

export const getRole = (context: Context): string => {
  const claims = getClaims(context)
  if (claims) return claims['x-hasura-default-role'] || UNAUTHORIZED_ROLE
  return UNAUTHORIZED_ROLE
}
