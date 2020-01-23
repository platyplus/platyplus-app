import { GenericRule } from './generic'

export class LodashRule extends GenericRule {
  constructor(template: string, fields: string[] = []) {
    super('lodash', [template], fields)
  }
}
