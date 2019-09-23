// TODO put the settings on server-side into a dedicated table-setting table, accessible through table.settgins
// ! the labels should be put in the i18n module
interface TableSettings {
  list_type: 'list' | 'tree'
  title_template: string
  orderBy: [] // TODO TBD
}
