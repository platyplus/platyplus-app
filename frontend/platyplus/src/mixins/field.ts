import { ObjectMap } from '../modules/common'
export class FieldMixin {
  public readonly property!: string
  public readonly element!: ObjectMap

  public get action() {
    return Object.keys(this.element).length == 0 ? 'insert' : 'update'
  }

  public get mask() {
    return undefined // TODO
  }
}
