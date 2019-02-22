import VueFormGenerator from 'vue-form-generator'
import cloneDeep from 'lodash/cloneDeep'
import 'vue-form-generator/dist/vfg.css'

export const makeReadOnly = schema => {
  if (!schema) return
  const roFields = fields => {
    if (fields) {
      return fields.map(field => {
        field.readonly = true
        return field
      })
    } else return fields
  }
  let res = cloneDeep(schema)
  res.fields = roFields(res.fields)
  if (res.groups) {
    res.groups = res.groups.map(group => {
      group.fields = roFields(group.fields)
      return group
    })
  }
  return res
}

export default ({ app, router, Vue, store }) => {
  Vue.use(VueFormGenerator)
}
