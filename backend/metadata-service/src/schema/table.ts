/* eslint-disable @typescript-eslint/camelcase */
import { Field, ObjectType, ID, Ctx } from 'type-graphql'
import { Context } from 'koa'
import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query'

import { tables } from '../data-loader'
import { getRole } from '../config'
import { ObjectMap } from '../core'

import { Label } from './label'
import {
  Relationship,
  SingleRelationship,
  RawRelationship,
  createRelationships,
  OneToManyRelationship,
  ManyToManyRelationship
} from './relationships'
import { Column, RawColumn } from './columns'
import { ForeignKey } from './foreign-keys'
import {
  Permission,
  Rule,
  Check,
  UniqueConstraint,
  MutationAction,
  createRules,
  ColumnAction,
  ActionType
} from './rules'
import { GenericField } from './field'
import { GraphQLNode, NodeScope } from './common'

export interface RawTable {
  name: string
  schema: string
  columns: RawColumn[]
  primary_key_columns: string[]
  foreign_keys: ForeignKey[]
  relationships: Relationship[]
  constraints: UniqueConstraint[]
  checks: Check[]
  permissions: Permission[]
}

// ? review semantics: property = columns/fields + relationships => GenericField -> Property and Column -> Field?

@ObjectType({ description: 'The table model' })
export class Table implements GraphQLNode {
  @Field(type => ID, { nullable: false })
  readonly name: string
  @Field(type => [Column], { name: 'fields' })
  readonly columns: Column[]
  // primaryKeyColumns: string[] // ? Remove definitely?
  readonly foreignKeys: ForeignKey[]
  readonly rawRelationships: RawRelationship[]
  readonly constraints: UniqueConstraint[]
  readonly checks: Check[]
  readonly permissions: Permission[]
  readonly isTransitionTable: boolean

  // Calculated fields on construction
  @Field(type => Label)
  readonly label: Label
  @Field(type => ID, { nullable: false })
  readonly id: string
  @Field(type => [Column], {
    description:
      'Columns that compose the id of the object, either primary key or manually defined in Hasura',
    nullable: false
  })
  readonly idFields: Column[]

  constructor({
    name,
    schema,
    columns,
    primary_key_columns: primaryKeyColumns,
    foreign_keys: foreignKeys,
    relationships,
    constraints,
    checks,
    permissions
  }: RawTable) {
    this.name = schema === 'public' ? name : `${schema}_${name}` // TODO set default schema ('public') as an env var
    this.columns = columns.map(rawColumn => new Column(this, rawColumn))
    // TODO ugly: use a new XXX() constuctor that makes the job, as in Column/RawColumn
    for (const foreignKey of foreignKeys) foreignKey.table = this
    this.foreignKeys = foreignKeys
    this.rawRelationships = relationships
    this.constraints = constraints
    // TODO ugly: use a new XXX() constuctor that makes the job, as in Column/RawColumn
    for (const check of checks) {
      check.check = check.check.substring(5) // Remove the 'CHECK ' part of the string so it can be direclty parsed
      check.table = this
    }
    this.checks = checks
    // TODO ugly: use a new XXX() constuctor that makes the job, as in Column/RawColumn
    this.permissions = permissions

    // * Data from the metadata settings table

    // * Calculated fields
    this.label = new Label(this)
    this.idFields = this.columns.filter(column =>
      primaryKeyColumns.includes(column.name)
    )
  }

  /*
   * Other methods that are valid regardless of the GraphQL execution context
   */

  @Field(type => [GenericField], {
    description:
      'Available fields (columns and relationships) that are in use in the table'
  })
  get fields() {
    // TODO sort the fields according to an order defined somewhere in the platyplus database schema
    // TODO relationships should implement genericfield
    return [...this.basicFields, ...this.relationships]
  }

  private _relationships: Relationship[]
  /*
   ! This Method needs to get all the tables loaded before being used
   */
  @Field(type => [Relationship], {
    description:
      'List of relationships (single or multiple) defined for the table.'
  })
  get relationships() {
    if (!this._relationships)
      this._relationships = createRelationships(this, tables)
    return this._relationships
  }

  // ? Move into a resolver file?
  @Field(type => [SingleRelationship], {
    description:
      'List of object relationships (ManyToOne and OneToOne) defined for the table.'
  })
  get singleRelationships() {
    // ? Only send the permitted fields for a specific role? => set a different method that would use this one
    return this.relationships.filter(
      relationship => relationship instanceof SingleRelationship
    )
  }

  // ? Move into a resolver file?
  @Field(type => [Relationship], {
    description:
      'List of array relationships (OneToMany and ManyToMany) defined for the table.'
  })
  get multipleRelationships() {
    // ? Only send the permitted fields for a specific role? => set a different method that would use this one
    return this.relationships.filter(
      relationship =>
        relationship instanceof OneToManyRelationship ||
        relationship instanceof ManyToManyRelationship
    )
  }

  // ? Move into a resolver file?
  @Field(type => [OneToManyRelationship], {
    description: 'List of OneToMany relationships defined for the table.'
  })
  get manyToOneRelationships() {
    // ? Only send the permitted fields for a specific role? => set a different method that would use this one
    return this.relationships.filter(
      relationship => relationship instanceof OneToManyRelationship
    )
  }

  // ? Move into a resolver file?
  @Field(type => [ManyToManyRelationship], {
    description: 'List of ManyToMany relationships defined for the table.'
  })
  get manyToManyRelationships() {
    // ? Only send the permitted fields for a specific role? => set a different method that would use this one
    return this.relationships.filter(
      relationship => relationship instanceof ManyToManyRelationship
    ) as ManyToManyRelationship[]
  }

  private _referenceFields: Column[]
  @Field(type => [Column], {
    description:
      'Columns that are pointing to another table. Typically foreign keys, but also columns defined in manually configured object relationships'
  })
  get referenceFields() {
    // ? Only send the permitted fields for a specific role? => set a different method that would use this one
    if (!this._referenceFields) {
      this._referenceFields = this.columns.filter(column =>
        this.singleRelationships.find(relationship =>
          relationship.mapping.find(
            mapping => mapping.from.name === column.name
          )
        )
      )
    }
    return this._referenceFields
  }

  private _basicFields: Column[]
  @Field(type => [Column], {
    description:
      "Columns that are not part of the id or pointing to another table. Typically, 'data' columns"
  })
  get basicFields() {
    if (!this._basicFields) {
      const idFieldNames = this.idFields.map(column => column.name)
      const referenceFieldNames = this.referenceFields.map(
        column => column.name
      )
      this._basicFields = this.columns.filter(
        column =>
          !idFieldNames.includes(column.name) &&
          !referenceFieldNames.includes(column.name)
      )
    }
    return this._basicFields
  }

  /*
   * Methods that depend on the GraphQL execution context, mostly on the role of the connected user
   * // ? If this is the only reason to compute then at query time, then it is possible to pre-process them on construction time with a map of roles
   */

  /**
   * @param context
   * @return Permissions of the user for this table, given this role
   */
  userPermissions(context: Context) {
    const role = getRole(context)
    const permissions = this.permissions.filter(
      permission => permission.role === role
    )
    return permissions && permissions[0]
  }

  /**
   * @param context
   * @return List of permitted columns
   */
  permittedColumnNames(context: Context, action: ColumnAction) {
    const permissions = this.userPermissions(context)
    if (permissions) {
      const actions = {
        select: permissions.select,
        insert: permissions.insert,
        update: permissions.update
      }
      const permission = actions[action]
      if (permission) {
        return permission.columns === '*'
          ? this.columns.map(column => column.name)
          : permission.columns
      }
    }
    return []
  }

  private canAction(context: Context, action: ActionType) {
    const permissions = this.userPermissions(context)
    return !!permissions && !!permissions[action] // TODO optional chaining
  }

  // ? Move into a resolver file?
  @Field(type => Boolean, {
    description:
      'Return true if the user is allowed to select elements in the table'
  })
  canSelect(@Ctx() context: Context) {
    return this.canAction(context, 'select')
  }

  // ? Move into a resolver file?
  @Field(type => Boolean, {
    description:
      'Return true if the user is allowed to insert elements in the table'
  })
  canInsert(@Ctx() context: Context) {
    return this.canAction(context, 'insert')
  }

  // ? Move into a resolver file?
  @Field(type => Boolean, {
    description:
      'Return true if the user is allowed to update elements in the table'
  })
  canUpdate(@Ctx() context: Context) {
    return this.canAction(context, 'update')
  }

  // ? Move into a resolver file?
  @Field(type => Boolean, {
    description:
      'Return true if the user is allowed to delete elements in the table'
  })
  canDelete(@Ctx() context: Context) {
    return this.canAction(context, 'delete')
  }

  // * The rules are cached into a map
  private _rules = new Map<string, Rule[] | undefined>()
  /**
   * * Returns an array of the rules to comply to perform the given action. Returns null if the action is not allowed.
   */
  rules(context: Context, action: MutationAction) {
    const key = `${getRole(context)}.${action}`
    if (!this._rules.get(key))
      this._rules.set(key, createRules(this, context, action))
    return this._rules.get(key)
  }

  // ? Move into a resolver file?
  @Field(type => [Rule], {
    nullable: true,
    description:
      'Returns an array of the rules to comply to insert an item. Returns null if no insert is not allowed.'
  })
  insertRules(@Ctx() context: Context) {
    return this.rules(context, 'insert')
  }

  // ? Move into a resolver file?
  @Field(type => [Rule], {
    nullable: true,
    description:
      'Returns an array of the rules to comply to update an item. Returns null if no update is not allowed.'
  })
  updateRules(@Ctx() context: Context) {
    return this.rules(context, 'update')
  }

  // ? Move into a resolver file?
  @Field(type => [Rule], {
    nullable: true,
    description:
      'Returns an array of the rules to comply to delete an item. Returns null if deletion is not allowed.'
  })
  deleteRules(@Ctx() context: Context) {
    return this.rules(context, 'delete')
  }

  // ? Make one single method with action as an argument e.g. list, getOne, insert, update, delete, for the subscription... ?
  @Field(type => [String], {
    name: 'query',
    description: 'Representation of the GraphQL query of the table'
  })
  query(@Ctx() context: Context) {
    const columnNames = this.permittedColumnNames(context, 'select')
    if (columnNames.length > 0) {
      // * Adds all the allowed columns to the query
      const result: string[] = [...columnNames]
      // * Scans the object relationships and adds their IDs
      for (const columnName of columnNames) {
        const objectRelationship = this.singleRelationships.find(relationship =>
          relationship.mapping.find(mapping => mapping.from.name === columnName)
        )
        if (objectRelationship) {
          result.push(
            ...objectRelationship.target.idFields.map(
              field => `${objectRelationship.name}.${field.name}`
            ),
            ...objectRelationship.target.label.requirements.map(
              fieldName => `${objectRelationship.name}.${fieldName}`
            )
          )
          // ? also adds the label of any object relationship, TO BE CONFIRMED
          // TODO if the relationship is nested (cascade on delete), recursively add its information to the graph
        }
      }
      // * Adds the required graph for generating the label
      result.push(...this.label.requirements)
      // return [...new Set(result)] // ? Remove duplicates
      return result
    } else return []
  }

  // TODO return null if not allowed
  @Field(type => String, {
    description: 'Representation of the GraphQL query of the table', // TODO improve the description
    nullable: true
  })
  listQuery(@Ctx() context: Context) {
    // TODO check aggregation permission
    // TODO sort list
    // if (this.canSelect(context))
    return jsonToGraphQLQuery({
      query: {
        result: {
          __aliasFor: `${this.name}_aggregate`,
          aggregate: {
            max: {
              updated_at: true
            }
          },
          nodes: this.toObject(context, 'select', 'deep')
        }
      }
    })
  }

  // TODO return null if not allowed
  @Field(type => String, {
    description:
      'Representation of the GraphQL query for getting one single element', // TODO improve the description
    nullable: true
  })
  elementQuery(@Ctx() context: Context) {
    return (
      this.canSelect(context) &&
      jsonToGraphQLQuery({
        query: {
          __variables: this.idFields.reduce(
            (aggr, field) => ({ ...aggr, [field.name]: `${field.type}!` }),
            {}
          ),
          result: {
            __aliasFor: `${this.name}_by_pk`,
            __args: this.idFields.reduce(
              (aggr, field) => ({
                ...aggr,
                [field.name]: new VariableType(field.name)
              }),
              {}
            ),
            ...this.toObject(context, 'select', 'deep')
          }
        }
      })
    )
  }

  toObject(
    context: Context,
    action: ColumnAction,
    scope: NodeScope = 'deep'
  ): ObjectMap {
    let result = this.idFields.reduce<ObjectMap>(
      (aggr, current) => ({
        ...aggr,
        ...current.toObject(context, action)
      }),
      {}
    )
    if (['column', 'deep'].includes(scope))
      result = this.basicFields.reduce<ObjectMap>(
        (aggr, current) => ({
          ...aggr,
          ...current.toObject(context, action)
        }),
        result
      )
    if (scope === 'deep')
      result = this.relationships.reduce<ObjectMap>(
        (aggr, current) => ({
          ...aggr,
          ...current.toObject(context, action, 'column')
        }),
        result
      )
    return result
  }
}
