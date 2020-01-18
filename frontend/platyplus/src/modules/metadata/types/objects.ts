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
  _metadata: Array<Table>
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
  optionsQuery?: Maybe<Scalars['String']>
}

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

export interface Table {
  __typename?: 'Table'
  name: Scalars['ID']
  fields: Array<GenericField>
  label: Label
  id: Scalars['ID']
  idFields: Array<Column>
  relationships: Array<Relationship>
  singleRelationships: Array<SingleRelationship>
  multipleRelationships: Array<Relationship>
  manyToOneRelationships: Array<OneToManyRelationship>
  manyToManyRelationships: Array<ManyToManyRelationship>
  referenceFields: Array<Column>
  basicFields: Array<Column>
  canSelect: Scalars['Boolean']
  canInsert: Scalars['Boolean']
  canUpdate: Scalars['Boolean']
  canDelete: Scalars['Boolean']
  insertRules?: Maybe<Array<Rule>>
  updateRules?: Maybe<Array<Rule>>
  deleteRules?: Maybe<Array<Rule>>
  query: Array<Scalars['String']>
  listQuery?: Maybe<Scalars['String']>
  elementQuery?: Maybe<Scalars['String']>
}
