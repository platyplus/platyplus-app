import { get } from 'object-path'
import { ObjectMap } from '../../core'
import {
  operationToLodash,
  HasuraExpression,
  hasuraToLodash,
  stringToOperation,
  columnName,
  constValue,
  functionName,
  getExp,
  getColumn,
  getConst,
  getFunction,
  expressionValue,
  getNullTest
} from '../../transformers'
import { GenericRule, LodashRule } from './kinds'

/* 
* List of implemented rules:
- required
- confirmed
- between
- length
- is
- max 
- max_value 
- min 
- min_value 

TODO List of rules to be implemented:
- alpha
- alpha_dash
- alpha_num
- alpha_spaces
- digits
- email Inferred
- oneOf
- integer
- is_not
- excluded
- numeric
- regex Inferred
- required_if

* Rules that won't be implemented (related to files or images)
- dimensions
- ext
- image
- mimes
- size

*/

export const mergeRules = (rules: GenericRule[]) => {
  const result = [...rules]
  // * Merge any couple of min_value/max_value rules for the same field into a 'between' rule
  rules
    .filter(rule => rule.type === 'max_value')
    .forEach((ruleMax, indexMax) => {
      const field = ruleMax.paths[0]
      const indexMin = rules.findIndex(
        ruleMin => ruleMin.type === 'min_value' && ruleMin.paths.includes(field)
      )
      if (indexMin >= 0) {
        result.push(
          new GenericRule('between', [
            rules[indexMin].parameters[0],
            ruleMax.parameters[0]
          ])
        )
        result.splice(Math.max(indexMax, indexMin), 1)
        result.splice(Math.min(indexMax, indexMin), 1)
      }
    })
  return result
}

export const sqlToVee = (value: string) => {
  let rootOperation = stringToOperation(value)
  // * Skip the typecast if the entire operation is typecasted
  if (rootOperation.TypeCast) rootOperation = rootOperation.TypeCast.arg
  let operations = [rootOperation]
  // * Use the list of sub-operations if the root operation is an 'AND' operation
  if (rootOperation.BoolExpr && rootOperation.BoolExpr.boolop === 0) {
    operations = rootOperation.BoolExpr.args
  }
  return operations.map(operation => {
    const expression = getExp(operation)
    if (expression) {
      const kind = expression.kind
      const left = expression.lexpr
      const right = expression.rexpr
      if (kind === 0) {
        const operator = expressionValue(operation)
        const column = getColumn(left) || getColumn(right)
        if (column) {
          const fields = [columnName(getColumn(left) ? left : right)]
          const other = getColumn(left) ? right : left
          if (getConst(other)) {
            const rules = new Map([
              ['=', 'is'],
              ['<=', 'max_value'],
              ['>=', 'min_value']
            ])
            const rule = rules.get(operator)
            if (rule) return new GenericRule(rule, [constValue(other)], fields)
          }
          if (getColumn(other)) {
            return new GenericRule('confirmed', [columnName(other)], fields)
          }
        }
        const func = getFunction(left) || getFunction(right)
        if (func) {
          const other = getFunction(left) ? right : left
          const funcName = functionName(getFunction(left) ? left : right)
          const funcArg = get(func, 'args.0')
          if (funcName === 'length' && getConst(other) && getColumn(funcArg)) {
            const rules = new Map([
              ['=', 'length'],
              ['<=', 'max'],
              ['>=', 'min']
            ])
            const rule = rules.get(operator)
            if (rule)
              return new GenericRule(
                rule,
                [constValue(other)],
                [columnName(funcArg)]
              )
          }
        }
      } else {
        console.warn(`Unknown expression kind number ${kind}`)
      }
    }
    const nullTest = getNullTest(operation)
    if (nullTest) {
      // * Convert any 'is not null' column to a required rule
      if (getColumn(nullTest.arg) && nullTest.nulltesttype === 1)
        return new GenericRule('required', [], [columnName(nullTest.arg)])
    }
    return new LodashRule(operationToLodash(operation))
  })
}

export const hasuraToVee = (
  expression: HasuraExpression,
  environment: ObjectMap = {}
) => {
  const singleHasuraToVee = (exp: HasuraExpression) => {
    const { template, fields } = hasuraToLodash(exp, environment)
    return new LodashRule(template, fields)
  }
  // TODO better granularity in the hasuraToLodash method -> code a hasuraToVee method similar to sqlToVee:
  // * OK: 1. decompose into subrules if the inital rule is an _and
  // TODO 2. recognise the patterns and match with vee rules when possible
  if (expression._and)
    return (expression._and as HasuraExpression[]).map(item =>
      singleHasuraToVee(item)
    )
  else return [singleHasuraToVee(expression)]
}
