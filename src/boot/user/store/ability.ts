/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ability } from '@casl/ability'

/**
 * The Casl engine requires a property in the object send against the ability in order
 * to idendify which 'subject' we are talking about.
 * Either the submitted object is a string, and in this case it is the subject,
 * or the object has
 * 1. a '$type' property - not being used for the moment, but could be the case at a later stage
 * 2. a '__typename' property (quite usefull as it is by default added in every Apollo query)
 *
 * @param subject
 */
function subjectName(subject: any) {
  return !subject || typeof subject === 'string'
    ? subject
    : subject.$type || subject.__typename
}
export const initialRules = () => [{ actions: 'read', subject: 'public' }]

// TODO shall we put the ability into the vuex store?
export const ability = new Ability(initialRules(), { subjectName })

/**
 * List of hasura filter keys that have a 'one on one' match with the sift rules system
 */
const hasuraKeys: Record<string, string> = {
  _and: '$and',
  _or: '$or',
  _not: '$not',
  _in: '$in',
  _nin: '$nin',
  _gte: '$gte',
  _gt: '$gt',
  _lte: '$lte',
  _lt: '$lt',
  _ne: '$ne',
  _eq: '$eq'
}

/**
 * List of hasura filter keys that require to translate the 'argument on the right'
 * as another property of the object the rules are tested against.
 */
const hasuraColumnKeys: Record<string, string> = {
  _ceq: '===',
  _cne: '!==',
  _cgt: '>',
  _cgte: '>=',
  _clt: '<',
  _clte: '<='
}

/**
 * Converts hasura permissions into sift rules, that are used by the casl engiine.
 * @param object the permission object e.g. { user_id: { _eq: 'X-Hasura-User-Id' } }
 * @param environment the environment variables defined in the hasura claims inside the JWT
 * TODO 'nested' properties such as { org_unit: { id: { _eq: 'X-Hasura-env-name' } } }
 * TODO translated into { 'org_unit.id': { $eq: '12345' } }
 */
export const hasuraToSift: any = (
  object: any,
  environment: Record<string, any>
) => {
  if (Array.isArray(object)) {
    return object.map(item => hasuraToSift(item, environment))
  } else if (typeof object === 'object') {
    const result: Record<string, any> = {}
    for (const key of Object.keys(object)) {
      if (typeof object[key] === 'string') {
        result[hasuraKeys[key] || key] = environment[object[key].toLowerCase()]
      } else if (key === '_is_null') result['$exists'] = !object[key]
      else {
        const nextKey = Object.keys(object[key])[0]
        if (Object.keys(hasuraColumnKeys).includes(nextKey))
          result['$where'] = `this.${key} ${hasuraColumnKeys[nextKey]} this.${
            object[key][nextKey]
          }`
        else
          result[hasuraKeys[key] || key] = hasuraToSift(
            object[key],
            environment
          )
      }
    }
    return result
  } else return object
}
