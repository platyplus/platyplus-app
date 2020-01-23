import { Column } from '../../fields'
import { GenericRule } from './generic'

export class RequiredRule extends GenericRule {
  constructor(column: Column) {
    super('required', undefined, [column.name])
  }
}
