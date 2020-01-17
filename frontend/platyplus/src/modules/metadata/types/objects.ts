//! |=============================================|
//! |== AUTO-GENERATED FILE !!! DO NOT MODIFY ====|
//! |=============================================|
/* eslint-disable @typescript-eslint/array-type */
export type Maybe<T> = T | null

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

/** Columns of an SQL table */
export interface Column extends GenericField {
  __typename?: 'Column'
  id: Scalars['ID']
  name: Scalars['String']
  component: Scalars['String']
  type: Scalars['String']
  domain?: Maybe<Scalars['String']>
  nullable: Scalars['Boolean']
  insertDefault?: Maybe<Scalars['String']>
  updateDefault?: Maybe<Scalars['String']>
  insertReadonly?: Maybe<Scalars['Boolean']>
  updateReadonly?: Maybe<Scalars['Boolean']>
  insertRules?: Maybe<Array<Rule>>
  updateRules?: Maybe<Array<Rule>>
  deleteRules?: Maybe<Array<Rule>>
}

export interface ColumnMapping {
  __typename?: 'ColumnMapping'
  from: Column
  to: Column
}

export interface GenericField {
  id: Scalars['ID']
  name: Scalars['String']
  component: Scalars['String']
}

export interface Label {
  __typename?: 'Label'
  template: Scalars['String']
}

export interface ManyToManyRelationship extends Relationship, GenericField {
  __typename?: 'ManyToManyRelationship'
  id: Scalars['ID']
  name: Scalars['String']
  component: Scalars['String']
  comment?: Maybe<Scalars['String']>
  target: Table
  mapping: Array<ColumnMapping>
  optionsQuery?: Maybe<Scalars['String']>
  through: Table
  throughMapping: Array<ColumnMapping>
}

export interface OneToManyRelationship extends Relationship, GenericField {
  __typename?: 'OneToManyRelationship'
  id: Scalars['ID']
  name: Scalars['String']
  component: Scalars['String']
  comment?: Maybe<Scalars['String']>
  target: Table
  mapping: Array<ColumnMapping>
  optionsQuery?: Maybe<Scalars['String']>
}

export interface Query {
  __typename?: 'Query'
  /** Get the metadata */
  _metadata: Array<Table>
  /** Get the metadata of one single table, per ID */
  _metadataTable?: Maybe<Table>
}

export interface QueryMetadataArgs {
  name?: Maybe<Scalars['String']>
}

export interface QueryMetadataTableArgs {
  name: Scalars['String']
}

export interface Relationship {
  id: Scalars['ID']
  name: Scalars['String']
  component: Scalars['String']
  comment?: Maybe<Scalars['String']>
  target: Table
  mapping: Array<ColumnMapping>
  /** Representation of the GraphQL query of the possible options of the relationship */
  optionsQuery?: Maybe<Scalars['String']>
}

/** Rule */
export interface Rule {
  __typename?: 'Rule'
  type: Scalars['String']
  parameters: Array<Scalars['String']>
  paths: Array<Scalars['String']>
}

export interface SingleRelationship extends Relationship, GenericField {
  __typename?: 'SingleRelationship'
  id: Scalars['ID']
  name: Scalars['String']
  component: Scalars['String']
  comment?: Maybe<Scalars['String']>
  target: Table
  mapping: Array<ColumnMapping>
  optionsQuery?: Maybe<Scalars['String']>
}

/** The table model */
export interface Table {
  __typename?: 'Table'
  name: Scalars['ID']
  /** Available fields (columns and relationships) that are in use in the table */
  fields: Array<GenericField>
  label: Label
  id: Scalars['ID']
  /** Columns that compose the id of the object, either primary key or manually defined in Hasura */
  idFields: Array<Column>
  /** List of relationships (single or multiple) defined for the table. */
  relationships: Array<Relationship>
  /** List of object relationships (ManyToOne and OneToOne) defined for the table. */
  singleRelationships: Array<SingleRelationship>
  /** List of array relationships (OneToMany and ManyToMany) defined for the table. */
  multipleRelationships: Array<Relationship>
  /** List of OneToMany relationships defined for the table. */
  manyToOneRelationships: Array<OneToManyRelationship>
  /** List of ManyToMany relationships defined for the table. */
  manyToManyRelationships: Array<ManyToManyRelationship>
  /**
   * Columns that are pointing to another table. Typically foreign keys, but also
   * columns defined in manually configured object relationships
   */
  referenceFields: Array<Column>
  /** Columns that are not part of the id or pointing to another table. Typically, 'data' columns */
  basicFields: Array<Column>
  /** Return true if the user is allowed to select elements in the table */
  canSelect: Scalars['Boolean']
  /** Return true if the user is allowed to insert elements in the table */
  canInsert: Scalars['Boolean']
  /** Return true if the user is allowed to update elements in the table */
  canUpdate: Scalars['Boolean']
  /** Return true if the user is allowed to delete elements in the table */
  canDelete: Scalars['Boolean']
  /** Returns an array of the rules to comply to insert an item. Returns null if no insert is not allowed. */
  insertRules?: Maybe<Array<Rule>>
  /** Returns an array of the rules to comply to update an item. Returns null if no update is not allowed. */
  updateRules?: Maybe<Array<Rule>>
  /** Returns an array of the rules to comply to delete an item. Returns null if deletion is not allowed. */
  deleteRules?: Maybe<Array<Rule>>
  /** Representation of the GraphQL query of the table */
  query: Array<Scalars['String']>
  /** Representation of the GraphQL query of the table */
  listQuery?: Maybe<Scalars['String']>
  /** Representation of the GraphQL query for getting one single element */
  elementQuery?: Maybe<Scalars['String']>
}
