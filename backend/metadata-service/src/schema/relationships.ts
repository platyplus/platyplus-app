import {
  Field,
  ObjectType,
  registerEnumType,
  InterfaceType,
  Ctx
} from 'type-graphql'

import { Table } from './table'
import { Column } from './columns'
import { GenericField } from './field'
import { ForeignKey } from './foreign-keys'
import { objectFlip, ObjectMap } from '../core'
import { Context } from 'koa'
import { ColumnAction } from './rules'
import { set } from 'object-path'
import { NodeScope } from './common'

export enum RelationshipType {
  OBJECT = 'object',
  ARRAY = 'array'
}

registerEnumType(RelationshipType, {
  name: 'RelationshipType',
  description: 'Relationship types'
})

export interface ManualRelationshipConfiguration {
  remote_table: string
  column_mapping: Record<string, string>
}
export type ForeignKeyConstraintDefinition =
  | string
  | { table: string | { name: string; schema: string }; column: string }

interface RelationshipDefinition {
  foreign_key_constraint_on?: ForeignKeyConstraintDefinition
  manual_configuration?: ManualRelationshipConfiguration
}

@ObjectType({ description: '' })
class ColumnMapping {
  @Field()
  from: Column
  @Field()
  to: Column
}

// * All the required raw data for building a relationship
export interface RawRelationship {
  name: string
  type: RelationshipType
  definition: RelationshipDefinition
  comment?: string
  mapping: ColumnMapping[]
}

// * Simple interface of a relationship
interface RelationshipInterface {
  table: Table
  name: string
  component: string
  target: Table
  mapping: ColumnMapping[]
  comment?: string
}

// * Interface of a ManyToMany relationship
interface ManyToManyRelationshipInterface extends RelationshipInterface {
  through: Table
  throughMapping: ColumnMapping[]
}

@InterfaceType()
export abstract class Relationship extends GenericField {
  type: RelationshipType
  definition: RelationshipDefinition
  @Field({ nullable: true })
  comment?: string
  @Field(type => Table)
  target: Table
  @Field(type => [ColumnMapping])
  mapping: ColumnMapping[]
  // TODO inverse
  // ? implement update/insert default?
  // TODO implement update/insert readonly
  constructor({
    table,
    name,
    component,
    target,
    mapping,
    comment
  }: RelationshipInterface) {
    super(table, name, component)
    this.target = target
    this.mapping = mapping
    this.comment = comment
  }

  @Field(type => String, {
    name: 'optionsQuery',
    description:
      'Representation of the GraphQL query of the possible options of the relationship',
    nullable: true
  })
  optionsQuery(@Ctx() context: Context) {
    console.warn(
      'optionsQuery should not be used in the Relationship abstract class'
    )
    return ''
  }
}

@ObjectType({ implements: [Relationship, GenericField], description: '' })
export class SingleRelationship extends Relationship {
  toObject(context: Context, action: ColumnAction, scope: NodeScope = 'id') {
    let result: ObjectMap = {}
    const fkColumns = this.mapping.map(m => m.from.name)
    if (
      fkColumns.every(fkName =>
        this.table.permittedColumnNames(context, 'select').includes(fkName)
      )
    ) {
      result = fkColumns.reduce<ObjectMap>(
        (aggr, curs) => ({ [curs]: true, ...aggr }),
        {}
      )
      // TODO only IDs and what's required for the child's label
      set(result, this.name, this.target.toObject(context, action, scope))
    }
    return result
  }

  @Field(type => String, { nullable: true })
  optionsQuery(@Ctx() context: Context) {
    return this.target.listQuery(context)
  }

  get idFields() {
    const idFieldNames = this.mapping.map(item => item.from.name)
    return this.table.columns.filter(column =>
      idFieldNames.includes(column.name)
    )
  }

  @Field(type => Boolean, { nullable: true })
  canSelect(@Ctx() context: Context) {
    return (
      this.idFields.every(field => field.canSelect(context)) &&
      this.target.canSelect(context)
    )
  }

  @Field(type => Boolean, { nullable: true })
  canInsert(@Ctx() context: Context) {
    return (
      this.idFields.every(field => field.canInsert(context)) &&
      this.target.canInsert(context)
    )
  }

  @Field(type => Boolean, { nullable: true })
  canUpdate(@Ctx() context: Context) {
    return (
      this.idFields.every(field => field.canUpdate(context)) &&
      this.target.canUpdate(context)
    )
  }
}

@ObjectType({ implements: [Relationship, GenericField], description: '' })
export class OneToManyRelationship extends Relationship {
  // TODO implement canSelect, Insert, Update
  toObject(context: Context, action: ColumnAction, scope: NodeScope = 'id') {
    const result: ObjectMap = {}
    const fkColumns = this.mapping.map(m => m.to.name)
    if (
      fkColumns.every(fkName =>
        this.target.permittedColumnNames(context, action).includes(fkName)
      )
    ) {
      // TODO only IDs and what's required for the child's label
      set(
        result,
        this.name,
        fkColumns.reduce<ObjectMap>(
          (aggr, curs) => ({ [curs]: true, ...aggr }),
          { ...this.target.toObject(context, action, scope) }
        )
      )
    }
    return result
  }

  @Field(type => String, { nullable: true })
  optionsQuery(@Ctx() context: Context) {
    return this.target.listQuery(context)
  }

  @Field(type => Boolean, { nullable: true })
  canSelect(@Ctx() context: Context) {
    return (
      // TODO can select the fk fields
      // this.idFields.every(field => field.canSelect(context)) &&
      this.target.canSelect(context)
    )
  }

  @Field(type => Boolean, { nullable: true })
  canInsert(@Ctx() context: Context) {
    return (
      // TODO can select the fk fields
      // this.idFields.every(field => field.canInsert(context)) &&
      this.target.canInsert(context)
    )
  }

  @Field(type => Boolean, { nullable: true })
  canUpdate(@Ctx() context: Context) {
    return (
      // TODO can select the fk fields
      // this.idFields.every(field => field.canUpdate(context)) &&
      this.target.canUpdate(context)
    )
  }
}

@ObjectType({ implements: [Relationship, GenericField], description: '' })
// TODO implement canSelect, Insert, Update
export class ManyToManyRelationship extends Relationship
  implements ManyToManyRelationshipInterface {
  @Field(type => Table)
  through: Table
  @Field(type => [ColumnMapping])
  throughMapping: ColumnMapping[]

  constructor(initialData: ManyToManyRelationshipInterface) {
    super(initialData)
    this.through = initialData.through
    this.throughMapping = initialData.throughMapping
  }

  toObject(context: Context, action: ColumnAction, scope: NodeScope = 'id') {
    // TODO mock code, to be rewritten
    return {
      [this.name]: this.table
        .permittedColumnNames(context, action)
        .includes(this.name)
    }
  }

  @Field(type => String, { nullable: true })
  optionsQuery(@Ctx() context: Context) {
    return this.target.listQuery(context)
  }

  originProperty() {
    return this.through.relationships.find(
      relationship => relationship.target.name === this.table.name
    )
  }
  targetProperty() {
    return this.through.relationships.find(
      relationship => relationship.target.name === this.target.name
    )
  }

  @Field(type => String)
  targetPropertyName() {
    return this.targetProperty()?.name
  }

  @Field(type => String)
  originPropertyName() {
    return this.originProperty()?.name
  }
}

interface FlatRelationship {
  name: string
  type: RelationshipType
  target: Table
  mapping: ColumnMapping[]
  comment?: string
}

/**
 * Creates a temporary array of relationships that are not yet fully functionnal.
 * This is required for M2M relationships as we need to get 'flat/temporary' relationships of the target table
 * @param table
 * @param tables
 */
export const flatRelationships = (table: Table, tables: Table[]) =>
  table.rawRelationships.map<FlatRelationship>(relationship => {
    const isArray = relationship.type === RelationshipType.ARRAY
    let target: Table
    let columnMapping: Record<string, string>
    let fkColumn = relationship.definition.foreign_key_constraint_on
    if (fkColumn) {
      // * Case of a relationship based on a foreign key
      let lookupTable: Table = table
      // * Look for the foreign key depending on how foreign_key_constraint_on is formatted
      if (typeof fkColumn !== 'string') {
        const fkTableName =
          typeof fkColumn.table === 'string'
            ? fkColumn.table
            : fkColumn.table.name
        lookupTable = tables.find(table => table.name === fkTableName) as Table // * Trick: pass the not found test
        fkColumn = fkColumn.column
      }
      const foreignKey = lookupTable.foreignKeys.find(fk =>
        Object.entries(fk.mapping).some(([from, to]) => from === fkColumn)
      ) as ForeignKey // * 'as' trick: will raise an error next if no foreign key is found
      const refTable = isArray ? foreignKey.table.name : foreignKey.ref_name
      target = tables.find(table => table.name === refTable) as Table // * 'as' trick: will raise an error next if no table is found
      columnMapping = foreignKey.mapping // Select the column mapping of the foreign key
    } else {
      // * Case of an object relationship based on manual configuration
      // TODO case of an array relationship based on manual configuration
      const configuration = relationship.definition
        .manual_configuration as ManualRelationshipConfiguration // * 'as' trick: will raise an error next if no manual_configuration is found
      const { name } =
        typeof configuration.remote_table === 'string'
          ? { name: configuration.remote_table }
          : configuration.remote_table
      target = tables.find(table => table.name === name) as Table // * 'as' trick: will raise an error next if no target is found
      columnMapping = isArray // Select the column mapping defined in the manual configuration
        ? objectFlip(configuration.column_mapping) // inversed mapping when array mapping
        : configuration.column_mapping
    }
    // Convert the column mapping from Record<string,string> to an array of {from:Column, to: Column}
    const mapping = isArray
      ? Object.entries(columnMapping).map(
          ([from, to]) => ({
            from: table.columns.find(column => column.name === to) as Column,
            to: target.columns.find(column => column.name === from) as Column
          }) // * 'as' tricks: will raise an error next if some columns are not found
        )
      : Object.entries(columnMapping).map(
          ([from, to]) => ({
            from: table.columns.find(column => column.name === from) as Column,
            to: target.columns.find(column => column.name === to) as Column
          }) // * 'as' tricks: will raise an error next if some columns are not found
        )
    return {
      name: relationship.name,
      type: relationship.type,
      target,
      mapping,
      comment: relationship.comment
    }
  })

/**
 * Generates all the relationships of a given table
 * @param table
 * @param tables
 */
export const createRelationships = (table: Table, tables: Table[]) =>
  flatRelationships(table, tables).map(flatRelationship => {
    if (flatRelationship.type === RelationshipType.OBJECT)
      // TODO kind: one-to-one
      return new SingleRelationship({
        table,
        component: 'many-to-one',
        ...flatRelationship
      })
    else {
      // * Determine if the 'Array' relationship is a ManyToMany (in identifying a transition table)
      const { target: through } = flatRelationship
      const idFieldNames = through.idFields.map(field => field.name)
      const originNamesInRef = flatRelationship.mapping.map(m => m.to.name)
      // * If the 'foreign key' in the target for the table of origin is also part of the ID of the target table
      if (originNamesInRef.every(name => idFieldNames.includes(name))) {
        // * Finds the first other relationship that is also part of the id
        const flatTargetRelationship = flatRelationships(
          through,
          tables
        ).find(rel =>
          rel.mapping.every(
            m =>
              idFieldNames.includes(m.from.name) &&
              !originNamesInRef.includes(m.from.name)
          )
        )

        if (flatTargetRelationship) {
          // * Bingo, we found a Many2Many relationship
          return new ManyToManyRelationship({
            table,
            name: flatRelationship.name,
            component: 'many-to-many', // TODO nested-many-to-many as well
            target: flatTargetRelationship.target,
            through,
            mapping: flatTargetRelationship.mapping,
            throughMapping: flatRelationship.mapping,
            comment: flatRelationship.comment
          })
        }
      }

      return new OneToManyRelationship({
        table,
        component: 'one-to-many',
        ...flatRelationship,
        target: through
      })
    }
  })
