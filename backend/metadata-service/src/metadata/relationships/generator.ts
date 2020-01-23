import { objectFlip } from '../../core'

import { Table } from '../tables'
import { Column, ForeignKey } from '../fields'

import { SingleRelationship } from './single'
import { OneToManyRelationship } from './one-to-many'
import {
  RelationshipType,
  ColumnMapping,
  ManualRelationshipConfiguration
} from './generic'
import { ManyToManyRelationship } from './many-to-many'

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
const flatRelationships = (table: Table, tables: Table[]) =>
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
        Object.entries(fk.mapping).some(([from]) => from === fkColumn)
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
