// TODO get rid of this, e.g. using Record?
type GenericObject = boolean | number | string | null | ObjectArray | ObjectMap
export interface ObjectMap {
  [key: string]: GenericObject
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ObjectArray extends Array<GenericObject> {}
