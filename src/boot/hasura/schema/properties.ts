import { Column, Relationship } from './tables-definition'
import { TableClass } from './table-class'
import uuidv1 from 'uuid/v1'

export interface Mapping {
  from: ColumnProperty
  to: ColumnProperty
}
export abstract class BaseProperty {
  public readonly tableClass: TableClass
  public readonly name: string
  public readonly type: string
  protected constructor(cls: TableClass, name: string, type: string) {
    this.tableClass = cls
    this.name = name
    this.type = type
  }
}
export class ColumnProperty extends BaseProperty {
  public readonly isId: boolean
  public readonly defaultValue?: string
  public constructor(tableClass: TableClass, column: Column) {
    super(tableClass, column.name, column.domain || column.type)
    // TODO nullable column, default value
    this.isId =
      !!tableClass.table.primary_key &&
      tableClass.table.primary_key.columns.includes(column.name)
    this.defaultValue = column.default || undefined
  }

  public get references() {
    return this.tableClass.relationshipProperties.filter(
      property =>
        !property.isMultiple &&
        property.mapping &&
        property.mapping.some(mapping => mapping.from.name === this.name)
    )
  }

  public get isReference() {
    return this.tableClass.relationshipProperties.some(
      property =>
        !property.isMultiple &&
        property.mapping &&
        property.mapping.some(mapping => mapping.from.name === this.name)
    )
  }

  public generateDefault() {
    const defaultFunctions: Record<string, Function> = {
      'gen_random_uuid()': uuidv1
    }
    if (this.defaultValue) {
      const defaultFunction = defaultFunctions[this.defaultValue]
      if (defaultFunction) return defaultFunction()
      else
        throw new Error(
          `Unknown function for the default value '${
            this.defaultValue
          }' of the column '${this.name}'.`
        )
    }
    throw new Error(`No default value defined for the column '${this.name}'.`)
  }
}

export class RelationshipProperty extends BaseProperty {
  public mapping: Mapping[] = []
  public constructor(cls: TableClass, relationship: Relationship) {
    super(cls, relationship.name, relationship.type)
  }

  public linkProperty(mapping: Mapping[]) {
    this.mapping = mapping
  }
  public get reference() {
    return this.mapping[0].to.tableClass
  }
  public get isMultiple() {
    return this.type === 'array'
  }
  public get keyColumns() {
    return this.mapping.map(mapping => mapping.from)
  }
}
