import gql from 'graphql-tag'

export const configTablesQuery = gql`
  query config_tables {
    table {
      table_name # required, part of the ID
      table_schema # required, part of the ID
      columns
      primary_key {
        table_schema # required, part of the ID
        table_name # required, part of the ID
        columns
        constraint_name
      }
      foreign_keys {
        table_schema # required, part of the ID
        table_name # required, part of the ID
        constraint_name # required, part of the ID
        column_mapping
        on_delete
        on_update
        ref_table_name
        ref_table_schema
      }
      relationships {
        table_schema # required, part of the ID
        table_name # required, part of the ID
        name # required, part of the ID
        comment
        definition
        type
      }
      check_constraints {
        table_schema # required, part of the ID
        table_name # required, part of the ID
        constraint_name # required, part of the ID
        check
      }
      permissions {
        table_schema # required, part of the ID
        table_name # required, part of the ID
        role_name # required, part of the ID
        delete
        insert
        role_name
        select
        update
      }
    }
  }
`
