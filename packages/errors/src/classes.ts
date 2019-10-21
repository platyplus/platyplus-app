import { ApolloError } from 'apollo-server-errors'
import { GraphQLError } from 'graphql'

export interface GenericError extends ApolloError {
  location: string
  message: string
  i18nPath: string
}
export interface ErrorTree {
  _errors?: GenericError[]
  [key: string]: ErrorTree | GenericError[] | undefined
}

export class InputError extends ApolloError
  implements GraphQLError, GenericError {
  constructor(table: string, field: string, type: string, message: string) {
    super(message, 'BAD_USER_INPUT', { table, field, type })
  }
  get location() {
    return `${this.extensions.exception.table}.${this.extensions.exception.field}`
  }
  get i18nPath() {
    return `${this.extensions.exception.table}.errors.${this.extensions.exception.field}.${this.extensions.exception.type}`
  }
}
