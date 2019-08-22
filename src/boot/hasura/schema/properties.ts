import { Column, Relationship } from './tables-definition'
import { TableClass } from './table-class'
import { PreGraphQl } from '../graphql'

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
  // TODO separate all graphql-related properties into the 'graphql' module?
  public abstract get preGraphQl(): PreGraphQl
  // public constructor(relationship: Relationship, other: boolean) {}
}
export class ColumnProperty extends BaseProperty {
  public readonly isId: boolean
  public constructor(tableClass: TableClass, column: Column) {
    super(tableClass, column.name, column.domain || column.type)
    // TODO nullable column, default value
    this.isId =
      !!tableClass.table.primary_key &&
      tableClass.table.primary_key.columns.includes(column.name)
  }

  public get preGraphQl() {
    // TODO separate all graphql-related properties into the 'graphql' module?
    return { [this.name]: true }
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
}

export class RelationshipProperty extends BaseProperty {
  public mapping: Mapping[] = []
  public constructor(cls: TableClass, relationship: Relationship) {
    super(cls, relationship.name, relationship.type)
  }
  // TODO separate all graphql-related properties into the 'graphql' module?
  public get preGraphQl() {
    // * Not ideal: selects only the id columns of the reference class, and if none, pick them all
    const refProperties = this.reference
      ? this.reference.idProperties.length
        ? this.reference.idProperties
        : this.reference.columnProperties
      : []
    return {
      // TODO include other required fields such as the name aka 'label'
      [this.name]:
        (refProperties.reduce((previous, current) => {
          return { ...previous, ...{ [current.name]: true } }
        }, {}) as { [key: string]: boolean }) || false
    }
  }
  public linkProperty(mapping: Mapping[]) {
    this.mapping = mapping
  }
  public get reference() {
    return this.mapping.length && this.mapping[0].to.tableClass
  }
  public get isMultiple() {
    return this.type === 'array'
  }
}
