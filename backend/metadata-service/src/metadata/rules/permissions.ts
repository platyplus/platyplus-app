import { ObjectMap } from '../../core'

interface FilterPermissionComponent {
  filter: ObjectMap
}
interface ColumnsPermissionComponent {
  columns: string[] | '*'
}
interface SetPermissionsComponent {
  set: Record<string, string>
}

type SelectPermission = FilterPermissionComponent &
  ColumnsPermissionComponent & {
    computed_fields: string[]
    allow_aggregations?: boolean
  }

type InsertPermission = ColumnsPermissionComponent &
  SetPermissionsComponent & {
    check: ObjectMap
  }

type UpdatePermission = ColumnsPermissionComponent &
  SetPermissionsComponent &
  FilterPermissionComponent

type DeletePermission = FilterPermissionComponent

export interface Permission {
  role: string
  select?: SelectPermission
  insert?: InsertPermission
  update?: UpdatePermission
  delete?: DeletePermission
}

export type UpsertAction = 'insert' | 'update'
export type ColumnAction = UpsertAction | 'select'
export type MutationAction = UpsertAction | 'delete'
export type ActionType = MutationAction | 'select'
