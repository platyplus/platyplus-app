import { ObjectMap } from './types'

/**
 * * Workaround for https://docs.hasura.io/1.0/graphql/manual/auth/authorization/roles-variables.html
 * TODO put in a 'core' module
 * Converts the values of the string properties of an object that are formated as a
 * PostgreSQL list into Javascript arrays.
 * @param from the initial object with possible properties such as "{something,something-else}"
 */
export const transformSqlLists = (from: ObjectMap) => {
  for (const key of Object.keys(from)) {
    const value = from[key] as string
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      from[key] = value
        .substring(1, value.length - 1)
        .split(',')
        .map(item => item.trim())
    }
  }
  return from
}
