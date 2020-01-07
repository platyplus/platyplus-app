/**
 * TODO export to a distinct package
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj: any) {
  // TODO review the entire code and use when adequate
  try {
    return Object.keys(obj).length === 0
  } catch {
    return true
  }
}
