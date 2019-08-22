import { TableClass } from './table-class'
import { TableDefinition } from './tables-definition'

// TODO works with table names, not yet in conjunction with (postgreslq) schema names
export class Schema {
  public readonly classes: TableClass[] = []
  public constructor(tables: TableDefinition[]) {
    this.classes = tables.map(table => new TableClass(this, table))
    for (const cls of this.classes) {
      cls.linkProperties()
    }
  }

  public getClass(name: string): TableClass {
    // TODO throw exception if not found
    return this.classes.find(clss => clss.name === name) as TableClass
  }
}
