// TODO get rid of this, e.g. using Record?
type GenericObject = boolean | number | string | null | ObjectArray | ObjectMap
export interface ObjectMap {
  [key: string]: GenericObject
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ObjectArray extends Array<GenericObject> {}

export interface Rule {
  actions: string | string[]
  subject: string | string[]
  conditions?: ObjectMap
  fields?: string[]
  inverted?: boolean // default is `false`
  reason?: string // mainly to specify why user can't do something. See forbidden reasons for details
}
