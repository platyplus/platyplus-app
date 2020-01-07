/**
 * TODO export into a distinct package
 */
export type GenericObject =
  | boolean
  | number
  | string
  | null
  | ObjectArray
  | ObjectMap

export interface ObjectMap {
  [key: string]: GenericObject
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ObjectArray extends Array<GenericObject> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj: any) {
  // TODO review the entire code and use when adequate
  return Object.keys(obj).length === 0
}

/**
 * flips keys and values in an object, e.g. {a: x, b: y} => {x:a, y:b}
 * @param obj
 */
export const objectFlip = (obj: Record<string, string>) => {
  const ret: Record<string, string> = {}
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key
  })
  return ret
}
