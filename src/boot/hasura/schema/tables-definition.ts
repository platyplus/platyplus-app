import gql from 'graphql-tag'
// TODO remove the specific filter about 'system tables' in the postgres view definitions, and prefer setting hasura permissions?
interface Permission {
  // TODO 4 different definitions?
  set?: {}
  check?: {}
  filter?: {}
  columns?: string[]
  allow_aggregations?: boolean
}
export interface PermissionSet {
  insert?: Permission
  update?: Permission
  select?: Permission
  delete?: Permission
}
export interface RelationshipForeignKeyDefinition {
  foreign_key_constraint_on: string | ColumnRef // TODO: what about keys on multiple columns?
}
export interface TableRef {
  name: string
  schema: string
}
export interface ColumnRef {
  table: string
  column: string
}
export interface RelationshipDefinition {
  remote_table: string | TableRef
  column_mapping: { [key: string]: string }
}
export interface RelationshipManualDefinition {
  manual_configuration: RelationshipDefinition
}
export interface Relationship {
  name: string
  type: string
  comment: string | null
  definition: RelationshipForeignKeyDefinition | RelationshipManualDefinition
  table_name?: string
}
export interface Column {
  name: string
  type: string
  domain: string | null
  default: string | null
  is_nullable: boolean
}
interface CheckConstraint {
  check: string
  constraint_name: string | null
}
interface ForeignKeyConstraint {
  column_mapping: { [key: string]: string }
  constraint_name: string
  // * a = no action, r = restrict, c = cascade, n = set null, d = set default
  // See https://www.postgresql.org/docs/9.1/catalog-pg-constraint.html
  on_delete: 'a' | 'r' | 'c' | 'n' | 'd'
  on_update: 'a' | 'r' | 'c' | 'n' | 'd'
  ref_table_name: string
  ref_table_schema: string
  table_name?: string
  table_schema?: string
}

export interface TableDefinition {
  table_name: string
  table_schema: string
  permissions: PermissionSet[]
  relationships: Relationship[]
  columns: Column[]
  check_constraints: CheckConstraint[]
  primary_key?: {
    constraint_name: string
    columns: string[]
  }
  foreign_keys: ForeignKeyConstraint[]
}

export const configTablesQuery = gql`
  query config_tables {
    table {
      table_name
      table_schema
      columns
      relationships {
        definition
        name
        type
      }
      primary_key {
        columns
        constraint_name
      }
      foreign_keys {
        column_mapping
        constraint_name
        on_delete
        on_update
        ref_table_name
        ref_table_schema
      }
      relationships {
        comment
        definition
        name
        type
      }
      check_constraints {
        check
        constraint_name
      }
      permissions {
        delete
        insert
        role_name
        select
        update
      }
    }
  }
`
