/* eslint-disable @typescript-eslint/camelcase */
import { Operation } from 'pg-query-parser'

import {
  processStringExpression,
  ProcessSettings,
  processOperation
} from './parser'

const settings: ProcessSettings<string> = {
  escapeFinal: (finalResult: string) => `<%= ${finalResult} %>`,
  functionsMapping: {
    // ! get this somehow on the frontend side
    gen_random_uuid: 'uuid',
    length: 'len',
    now: 'Date.now'
  },
  operationsMapping: {
    '=': '===',
    '<>': '!==',
    '~': 'TODO', // TODO
    '!~': 'TODO', // TODO
    '~~': 'TODO', // TODO
    '~~*': 'TODO', // TODO
    '>': '>',
    '>=': '>=',
    '<': '<',
    '<=': '<='
  },
  mergeExpression: (operationName, left, right) =>
    `${left} ${operationName} ${right}`,
  mergeFunction: (operationName, args) => `${operationName}(${args.join(',')})`,
  mergeIsNull: arg => `!${arg}`,
  mergeIsNotNull: arg => `!!${arg}`
}

/**
 * Converts an SQL expression into a Lodash template
 * @param value
 */
// ? wrap columns into a 'data' object.
// ? See: https://stackoverflow.com/questions/15283741/ignoring-undefined-data-vars-in-an-underscore-template
// ? same for hasuraToLodash
export const sqlToLodash = (value: string) =>
  processStringExpression<string>(value, settings)

/**
 * Converts a parsed SQL operation into a Lodash template
 * @param value
 */
export const operationToLodash = (operation: Operation) =>
  processOperation<string>(operation, settings)
