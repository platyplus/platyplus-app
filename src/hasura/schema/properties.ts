import { Column, Relationship, ForeignKeyConstraint } from '../../types/tables'
import TableClass from './table-class'
import uuidv1 from 'uuid/v1'

export interface Mapping {
  from: ColumnProperty
  to: ColumnProperty
}
export abstract class BaseProperty {
  public readonly tableClass: TableClass
  public readonly name: string
  public readonly type: string
  /**
   * * Returns whether the property is required or not.
   */
  public abstract readonly required: boolean
  public abstract readonly isColumn: boolean
  public abstract readonly isMultiple: boolean
  public abstract readonly isOwnedByClass: boolean
  /**
   * * Returns the default kind of component to use to represent the property.
   * By default, it is the postgresql/graphql type
   * If the property is a relationship, then it checks if it is part ('owned') of the class.
   * * A relationship is 'owned' by its table class when it's cascade deleted.
   */
  public abstract readonly componentKind: string
  protected constructor(cls: TableClass, name: string, type: string) {
    this.tableClass = cls
    this.name = name
    this.type = type
  }
}
export class ColumnProperty extends BaseProperty {
  public readonly isId: boolean
  public readonly required: boolean
  public readonly isColumn = true
  public readonly isMultiple = false
  public readonly isOwnedByClass = true
  public readonly defaultValue?: string
  public constructor(tableClass: TableClass, column: Column) {
    super(tableClass, column.name, column.domain || column.type)
    // TODO nullable column, default value
    this.isId =
      !!tableClass.table.primary_key &&
      tableClass.table.primary_key.columns.includes(column.name)
    this.defaultValue = column.default || undefined // TODO set the function straight ahead?
    this.required = !column.is_nullable && !column.default
  }

  public get componentKind() {
    return this.type || 'text'
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
      // TODO ugly
      'gen_random_uuid()': uuidv1,
      "'{}'::jsonb": () => ({}),
      true: () => true,
      false: () => false,
      "'en-uk'::text": () => 'en-uk'
    }
    if (this.defaultValue) {
      const defaultFunction = defaultFunctions[this.defaultValue]
      if (defaultFunction) return defaultFunction()
      else
        throw new Error(
          `Unknown function for the default value '${this.defaultValue}' of the column '${this.name}'.`
        )
    }
    throw new Error(`No default value defined for the column '${this.name}'.`)
  }
}

export class RelationshipProperty extends BaseProperty {
  public mapping: Mapping[] = []
  public readonly isColumn = false
  public through?: RelationshipProperty
  public foreignKeyConstraint?: ForeignKeyConstraint
  /**
   * * The 'inverse' property is the other property that can exist in case of a two-ways relationship binding.
   * E.g. if a 'car' has a property 'owner' and a 'person' has a property 'cars',
   * then the inverse of 'owner' will be 'cars' and vice-versa
   */
  public inverse?: RelationshipProperty
  public constructor(cls: TableClass, relationship: Relationship) {
    super(cls, relationship.name, relationship.type)
  }

  /**
   * * Flags the property as required if one of its key columns is required.
   */
  public get required() {
    return this.keyColumns.some(column => column.required)
  }

  /**
   * * Express whether the relationship is 'many to one' or 'many to many' rather than 'one to many'
   */
  public get isMultiple() {
    return this.type === 'array'
  }

  /**
   * * The relationship is considered as part of the parent object if it is cascade deleted
   */
  public get isOwnedByClass() {
    return (
      !!this.inverse &&
      !!this.inverse.foreignKeyConstraint &&
      this.inverse.foreignKeyConstraint.on_delete === 'c'
    )
  }

  public get componentKind() {
    if (this.isMultiple) {
      if (this.isManyToMany) {
        if (this.isSimpleManyToMany) return 'many-to-many'
        else return 'nested-many-to-many'
        // TODO: if properties other than the two FK, then the component eihter be:
        // nested-many-to-many if not too much keys (and if isOwnedByClass?)
        // complete-many-to-many (allors to show the full form for each item, in a popup or something)
      } else {
        return 'one-to-many'
        // TODO nested or complete (popup-like) components. How to decide which one to use?
      }
    } else {
      return 'many-to-one'
      // TODO 'nested' or 'complete' object.
    }
  }

  /**
   * * The 'reference' class is the table class the relationship refers to.
   * E.g. if a 'car' table has an 'owner' relationship property,
   * then the reference will return the table class of the owner, for instance 'person'
   */
  public get reference() {
    return this.mapping[0].to.tableClass
  }

  public get isManyToMany() {
    return !!this.through
  }

  /**
   * * A 'Simple' Many-To-Many relationship has no other columns than
   * * the ones composing the two foreign key relationships
   */
  public get isSimpleManyToMany() {
    return (
      !!this.through &&
      this.through.tableClass.columnProperties.every(
        prop => prop.isReference
      ) &&
      this.through.tableClass.relationshipProperties.length === 2
    )
  }
  /**
   * * Returns the foreign key column properties of the relationship
   */
  public get keyColumns() {
    if (this.isMultiple) return [] as ColumnProperty[]
    else return this.mapping.map(mapping => mapping.from)
  }

  public linkProperty(mapping: Mapping[]) {
    this.mapping = mapping
    const foreignKeyColumnNames = mapping.map(map => map.from.name)
    this.foreignKeyConstraint = this.tableClass.table.foreign_keys.find(fk =>
      Object.keys(fk.column_mapping).every(columnName =>
        // * test the schema name (e.g. 'public') as well
        foreignKeyColumnNames.includes(columnName)
      )
    )
    // * Searches the 'inverse' relationship on the reference table class, and link them together
    const inverse = this.reference.relationshipProperties.find(
      property =>
        !!property.mapping.length &&
        property.mapping.every(map =>
          foreignKeyColumnNames.includes(map.to.name)
        )
    )
    if (inverse) {
      this.inverse = inverse
      this.inverse.inverse = this
    }
  }

  public linkManyToManies() {
    const refHasBothPkFk = this.reference.idProperties.some(
      property =>
        property.isReference &&
        property.references.some(
          reference => reference.name === this.tableClass.name
        )
    )
    if (refHasBothPkFk) {
      const throughColProperty = this.reference.idProperties.find(
        property =>
          property.isReference &&
          property.references.some(
            reference => reference.name !== this.tableClass.name
          )
      )
      if (throughColProperty) {
        this.through = throughColProperty.references[0]
      }
    }
  }
}
