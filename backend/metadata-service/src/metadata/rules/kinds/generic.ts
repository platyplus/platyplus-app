import { ObjectType, Field } from 'type-graphql'

@ObjectType('Rule', { description: 'Rule' })
export class GenericRule {
  // TODO figure out how to set an ID. By default, it can be a generated uuid on instanciation, but it won't be peristent over time...
  @Field(type => String)
  type: string
  @Field(type => [String])
  parameters: string[]
  @Field(type => [String])
  paths: string[] // ? Not sure this is the information the client needs. E.g. to get nested fields "object.id" would be more helpful. Then rename 'columns' to 'paths'?

  constructor(
    type?: string,
    parameters: string[] | string = [],
    paths: string[] = []
  ) {
    if (type) this.type = type
    this.parameters = typeof parameters === 'string' ? [parameters] : parameters
    this.paths = paths
  }
}
