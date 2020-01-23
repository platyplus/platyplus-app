import { GenericRule } from './generic'
import { UniqueConstraint } from '../constraints'

export class UniqueRule extends GenericRule {
  constructor(constraint: UniqueConstraint) {
    super('unique', constraint.columns, constraint.columns)
  }
}
