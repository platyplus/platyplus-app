import { parse, Operation, BooleanOperation } from 'pg-query-parser'
import {
  valueOf,
  columnName,
  constValue,
  functionName,
  getColumn,
  getFunction,
  getConst,
  getExp,
  getBoolExp,
  getNullTest
} from './helpers'

/**
 * Process recursively a parser SQL operation, according to specific settings
 * @param operation
 * @param settings
 */
const parseExpression = <T extends string | {}>(
  operation: Operation,
  settings: ParseSettings<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  // * Column?
  if (getColumn(operation)) return columnName(operation)
  // * Function?
  const func = getFunction(operation)
  if (func) {
    // Arguments separator
    const args: Operation[] = func.args
      ? func.args.map(arg => parseExpression(arg, settings))
      : []
    // Function name
    const funcName = functionName(operation)
    const mappedFunctionName = settings.functionsMapping[funcName] || funcName
    // Function encapsulator
    return settings.mergeFunction(mappedFunctionName, args)
  }
  // * Constant?
  if (getConst(operation)) return constValue(operation)
  // * Expression?
  const expression = getExp(operation)
  if (expression) {
    const operationName = valueOf(expression.name)
    const mappedOperationName =
      settings.operationsMapping[operationName] || operationName
    const left = parseExpression(expression.lexpr, settings)
    const right = parseExpression(expression.rexpr, settings)
    return settings.mergeExpression(mappedOperationName, left, right)
  }
  // * Boolean expression?
  const boolExp = getBoolExp(operation)
  if (boolExp) {
    const mappedOperationName = settings.escapeBooleanOperation(
      settings.booleanOperationsMapping[boolExp.boolop]
    )
    return boolExp.args // ? operation as param
      .map(arg => `${parseExpression(arg, settings)}`) // ? parentheses?
      .join(mappedOperationName)
  }
  // * Null test?
  const nullTest = getNullTest(operation)
  if (nullTest) {
    const result = parseExpression(nullTest.arg, settings)
    if (nullTest.nulltesttype === 0) return settings.mergeIsNull(result)
    else if (nullTest.nulltesttype === 1) return settings.mergeIsNotNull(result)
    else throw Error(`Unkown null test type ${nullTest.nulltesttype}`)
  }
  throw Error('Unknown operation')
}

/**
 * Options being used by the SQL operation, including the details on what is required and what is optional
 */
interface ParseOptions<T> {
  mergeExpression: (operationName: string, left: T, right: T) => T
  mergeFunction: (functionName: string, args: Operation[]) => T
  mergeIsNull: (arg: Operation) => T
  mergeIsNotNull: (arg: Operation) => T
  escapeBooleanOperation?: (operation: string) => string
  functionsMapping?: Record<string, string>
  operationsMapping?: Record<string, string>
  booleanOperationsMapping?: Record<BooleanOperation, string>
}

/**
 * Settings for the SQL operation processor: all the options are required
 */
type ParseSettings<T> = Required<ParseOptions<T>>

/**
 * Available settings for the 'root' string SQL expression
 */
export interface ProcessSettings<T> extends ParseOptions<T> {
  escapeFinal?: (finalResult: T) => T
}

enum BoolOp {
  AND = 0,
  OR = 1,
  NOT = 2
}

/**
 * Gets the parsed SQL operation from a string SQL expression
 * @param value a string SQL expression
 */
export const stringToOperation = (value: string): Operation =>
  parse(`SELECT 1 WHERE ${value}`).query[0].SelectStmt.whereClause

/**
 * Small helper to complete settings with default values
 * @param settings
 */
const getSettings = <T>(
  settings: ProcessSettings<T>
): Required<ProcessSettings<T>> => {
  // * Set default settings
  const defaults: Omit<
    ParseSettings<T>,
    'mergeExpression' | 'mergeFunction' | 'mergeIsNull' | 'mergeIsNotNull'
  > = {
    escapeBooleanOperation: operation => ` ${operation} `,
    functionsMapping: {},
    operationsMapping: {},
    booleanOperationsMapping: {
      [BoolOp.AND]: '&&',
      [BoolOp.OR]: '||',
      [BoolOp.NOT]: '!'
    }
  }
  return {
    escapeFinal: value => value,
    ...defaults,
    ...settings
  }
}

/**
 *
 * @param value the string SQL expression
 * @param settings the configuration of the parser
 */
export const processStringExpression = <T>(
  value: string,
  settings: ProcessSettings<T>
) => {
  const { escapeFinal, ...parseSettings } = getSettings(settings)
  return escapeFinal(
    parseExpression<T>(
      stringToOperation(value),
      parseSettings as ParseSettings<T>
    )
  )
}

export const processOperation = <T>(
  value: Operation,
  settings: ProcessSettings<T>
) => {
  const { escapeFinal, ...parseSettings } = getSettings(settings)
  return escapeFinal(
    parseExpression<T>(value, parseSettings as ParseSettings<T>)
  )
}
