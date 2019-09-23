import { ObjectMap } from './common'

export interface Rule {
  actions: string | string[]
  subject: string | string[]
  conditions?: ObjectMap
  fields?: string[]
  inverted?: boolean // default is `false`
  reason?: string // mainly to specify why user can't do something. See forbidden reasons for details
}
