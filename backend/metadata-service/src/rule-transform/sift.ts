/* eslint-disable @typescript-eslint/camelcase */
import { ProcessSettings, processStringExpression } from './parser'

/**
 * ! Unfinished and unstable function. Unused for now, but who know what would come next
 * Converts an SQL expression into a Sift object
 * @param value
 */
export const sqlToSift = (value: string) => {
  // ? what happens to function args in SIFT/object? An array? an __args key?
  const settings: ProcessSettings<{}> = {
    escapeFinal: finalResult => finalResult,
    functionsMapping: {
      // ! get this somehow on the frontend side
      gen_random_uuid: 'uuid',
      length: 'len'
    },
    operationsMapping: {
      '=': '_eq',
      '>': '_gt',
      '>=': '_gte',
      '<': '_gt',
      '<=': '_gte'
    },
    mergeExpression: (operationName, left, right) => {
      if (typeof left === 'string')
        return { [left]: { [operationName]: right } }
      else {
        // TODO vaseux, non récursif
        const [leftKey, leftValue] = Object.entries(left)[0] as [string, string]
        return {
          [leftValue]: {
            [leftKey]: {
              [operationName]: right
            }
          }
        }
      }
    },
    mergeFunction: (functionName, args) => {
      if (args.length !== 1)
        console.warn(
          "Don't know how to handle functions with multiple arguments"
        ) // TODO
      return {
        [functionName]: args[0]
      }
    },
    mergeIsNull: arg => ({ _is_null: arg }),
    mergeIsNotNull: arg => ({ _is_null: arg })
  }
  return processStringExpression<{}>(value, settings)
}
