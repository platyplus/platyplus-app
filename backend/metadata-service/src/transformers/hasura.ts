import { ObjectMap } from '../core'
import { get } from 'object-path'

/* eslint-disable @typescript-eslint/camelcase */
// ? Put the following definitions elsewhere? In @platyplus/common?

type Operators =
  | '_eq'
  | '_ne'
  | '_in'
  | '_nin'
  | '_gt'
  | '_lt'
  | '_gte'
  | '_lte'
  | '_is_null'
  | '_like'
  | '_nlike'
  | '_ilike'
  | '_nilike'
  | '_similar'
  | '_nsimilar'

type BooleanOperators = '_and' | '_or' | '_not'

export type HasuraExpression = {
  [operartor in Operators | BooleanOperators | string]:
    | HasuraExpression
    | HasuraExpression[]
    | string
    | string[]
    | boolean
    | number
}

const operatorsMapping: { [key in Operators]: string } = {
  _eq: '===',
  _ne: '!==',
  _in: 'IN', // TODO
  _nin: 'NOT IN', // TODO
  _gt: '>',
  _lt: '<',
  _gte: '>=',
  _lte: '<=',
  _is_null: 'IS NULL', // TODO
  _like: 'LIKE', // TODO
  _nlike: 'NOT LIKE', // TODO
  _ilike: 'ILIKE', // TODO
  _nilike: 'NOT ILIKE', // TODO
  _similar: 'SIMILAR TO', // TODO
  _nsimilar: 'NOT SIMILAR TO' // TODO
  // TODO other hasura functions such as _c*
}
const booleanOperatorsMapping: { [key in BooleanOperators]: string } = {
  _and: '&&',
  _or: '||',
  _not: '!'
}

const recursiveHasuraToLodash = (
  expression: HasuraExpression,
  environment: ObjectMap,
  fields: string[] = [],
  currentFieldPath: string[] = []
): { template: string; fields: string[] } => {
  if (typeof expression === 'string' || typeof expression === 'number')
    return {
      template: JSON.stringify(expression) || '',
      fields
    }
  else {
    const operator = Object.keys(expression)[0]
    const subExpression = get(expression, operator)
    if (operator in booleanOperatorsMapping) {
      switch (operator) {
        case '_and':
          return {
            template: `(${(subExpression as HasuraExpression[])
              .map(
                element =>
                  recursiveHasuraToLodash(element, environment, fields, [])
                    .template
              )
              .join(' && ')})`,
            fields
          }
        case '_or':
          return {
            template: `(${(subExpression as HasuraExpression[])
              .map(
                element =>
                  recursiveHasuraToLodash(element, environment, fields, [])
                    .template
              )
              .join(' || ')})`,
            fields
          }
        case '_not':
          return {
            template: `!(${
              recursiveHasuraToLodash(subExpression, environment, fields, [])
                .template
            })`,
            fields
          }
        default:
          return { template: '', fields }
      }
    } else if (operator in operatorsMapping) {
      const mappedOperator = operatorsMapping[operator as Operators]
      const environmentKey = String(subExpression).toLowerCase()
      const environmentValue = JSON.stringify(
        get(environment, environmentKey, subExpression)
      )
      return {
        template: ` ${mappedOperator} ${environmentValue}`,
        fields
      }
    } else if (operatorsMapping[Object.keys(subExpression)[0] as Operators]) {
      // end of value
      fields.push([...currentFieldPath, operator].join('.'))
      const result = recursiveHasuraToLodash(
        subExpression,
        environment,
        fields,
        []
      )
      return {
        template: `${operator}${result.template}`,
        fields: result.fields
      }
    } else {
      // transition value
      currentFieldPath.push(operator)
      const result = recursiveHasuraToLodash(
        subExpression,
        environment,
        fields,
        currentFieldPath
      )
      return {
        template: `${operator}.${result.template}`,
        fields: result.fields
      }
    }
  }
}

export const hasuraToLodash = (
  // TODO return an array of the fields in use
  // TODO transpose the environment values
  expression: HasuraExpression,
  environment: ObjectMap = {}
) => {
  const { template, fields } = recursiveHasuraToLodash(expression, environment)
  return {
    template: `<%= ${template} %>`,
    fields
  }
}
