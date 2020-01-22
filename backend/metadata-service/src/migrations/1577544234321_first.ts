/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder } from 'node-pg-migrate'
import { sql } from 'slonik'
import { METADATA_SCHEMA, DATA_SCHEMA } from '../config'

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable(
    'table',
    {
      name: {
        type: 'string',
        primaryKey: true
      },
      schema: {
        type: 'string',
        primaryKey: true,
        default: DATA_SCHEMA
      }
    },
    { ifNotExists: true }
  )

  pgm.createView(
    'metadata',
    { replace: true },
    sql`SELECT tables.table_name as name,
            tables.table_schema as schema,
            COALESCE(columns.columns, '[]'::json) AS columns,
            COALESCE(pk.columns, '[]'::json) AS primary_key_columns,
            COALESCE(fk.foreign_keys, '[]'::json) AS foreign_keys,
            COALESCE(relationships.relationships, '[]'::json) AS relationships,
            COALESCE(constraints.constraints, '[]'::json) AS constraints,
            COALESCE(checks.checks, '[]'::json) AS checks,
            COALESCE(permissions.permissions, '[]'::json) AS permissions,
            COALESCE(views.view_info, 'null'::json) AS view_info
        FROM information_schema.tables tables
            -- Columns
            LEFT JOIN ( SELECT c.table_name,
                        c.table_schema,
                        json_agg(json_build_object('name', c.column_name, 'type', c.udt_name, 'domain', c.domain_name, 'default', c.column_default, 'nullable', c.is_nullable::boolean)) AS columns
                        FROM information_schema.columns c
                        GROUP BY c.table_schema, c.table_name) columns ON tables.table_schema::text = columns.table_schema::text AND tables.table_name::text = columns.table_name::text
            -- Primary key
            LEFT JOIN ( SELECT hdb_primary_key.table_schema,
                        hdb_primary_key.table_name,
                        hdb_primary_key.constraint_name,
                        hdb_primary_key.columns
                        FROM hdb_catalog.hdb_primary_key) pk ON tables.table_schema::text = pk.table_schema::text AND tables.table_name::text = pk.table_name::text
            -- Foreign keys
            LEFT JOIN ( SELECT c.table_schema,
                        c.table_name,
                        json_agg(json_build_object('ref_name', c.ref_table, 'ref_schema', c.ref_table_table_schema, 'mapping', c.column_mapping, 'on_update', c.on_update, 'on_delete', c.on_delete)) AS foreign_keys
                        FROM hdb_catalog.hdb_foreign_key_constraint c
                        GROUP BY c.table_schema, c.table_name) fk
                    ON tables.table_schema::text = fk.table_schema::text AND tables.table_name::text = fk.table_name::text
            -- Relationships
            LEFT JOIN ( SELECT r.table_schema,
                        r.table_name,
                        json_agg(json_build_object('name', r.rel_name, 'type', r.rel_type, 'definition', r.rel_def, 'comment', r.comment)) AS relationships
                        FROM hdb_catalog.hdb_relationship r
                        WHERE r.is_system_defined IS FALSE
                        GROUP BY r.table_schema, r.table_name) relationships
                    ON tables.table_schema::text = relationships.table_schema::text AND tables.table_name::text = relationships.table_name::text
            -- Constraints
            LEFT JOIN ( SELECT c.table_schema,
                        c.table_name,
                        json_agg(json_build_object('name',constr.constraint_name, 'columns', constr.column_names)) AS constraints
                        FROM information_schema.table_constraints c
                            left join ( select json_agg(column_name) as column_names,
                                            constraint_name,
                                            table_name,
                                            table_schema
                                        from information_schema.constraint_column_usage cols
                                        group by cols.table_schema, cols.table_name, cols.constraint_name) constr
                                on c.constraint_name = constr.constraint_name
                                    AND c.table_schema = constr.table_schema
                                    AND c.table_name = constr.table_name
                        WHERE c.constraint_type::text = 'UNIQUE'::text OR c.constraint_type::text = 'PRIMARY KEY'::text
                        GROUP BY c.table_schema, c.table_name) constraints
                    ON tables.table_schema::text = constraints.table_schema::text AND tables.table_name::text = constraints.table_name::text
            -- Checks
            LEFT JOIN ( SELECT c.table_schema,
                        c.table_name,
                        json_agg(json_build_object('name', c.constraint_name, 'check',  c."check")) AS checks
                        FROM hdb_catalog.hdb_check_constraint c
                        GROUP BY c.table_schema, c.table_name ) checks ON tables.table_schema::text = checks.table_schema::text AND tables.table_name::text = checks.table_name::text
            -- Permissions
            LEFT JOIN ( SELECT table_schema,
                        table_name,
                        json_agg(permission) as permissions
                        FROM (SELECT table_schema,
                                table_name,
                                role_name,
                                jsonb_build_object('role', p.role_name) || jsonb_object_agg(p.perm_type, p.perm_def) as permission
                            FROM hdb_catalog.hdb_permission p
                            GROUP BY p.table_schema, p.table_name, p.role_name) s
                        GROUP BY s.table_schema, s.table_name) permissions ON tables.table_schema::text = permissions.table_schema::text AND tables.table_name::text = permissions.table_name::text
            -- Additional settings
            LEFT JOIN ( SELECT t.schema,
                        t.name
                        FROM ${sql.identifier([METADATA_SCHEMA, 'table'])} t
                      ) settings ON tables.table_schema::text = settings.schema::text AND tables.table_name::text = settings.name::text
            -- View info: not being used (yet?)
            LEFT JOIN ( SELECT v.table_schema,
                        v.table_name,
                        json_build_object('is_updatable', v.is_updatable::boolean OR v.is_trigger_updatable::boolean, 'is_deletable', v.is_updatable::boolean OR v.is_trigger_deletable::boolean, 'is_insertable', v.is_insertable_into::boolean OR v.is_trigger_insertable_into::boolean) AS view_info
                        FROM information_schema.views v) views ON tables.table_schema::text = views.table_schema::text AND tables.table_name::text = views.table_name::text
            JOIN hdb_catalog.hdb_table ON tables.table_schema::text = hdb_table.table_schema AND tables.table_name::text = hdb_table.table_name AND hdb_table.is_system_defined IS FALSE`
      .sql
  )
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropView('metadata', { ifExists: true })
  pgm.dropTable('table', { ifExists: true })
}
