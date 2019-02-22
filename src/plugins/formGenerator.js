import VueFormGenerator from 'vue-form-generator'
import cloneDeep from 'lodash/cloneDeep'
import template from 'lodash/template'
import 'vue-form-generator/dist/vfg.css'
/**
 * Generates a new schema that locks all the fields against modification
 * @param {the initial schema with the vue-form-builder syntax} schema
 * @returns a clone of the initial schema with all fields marked as read-only
 * TODO: some fields are still not r/o
 */
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

/**
 * Prepares the schema and model to be used in a vue-form-builder component.
 *  - Sets the computed fields (the ones with a 'computed' attribute as read-only, binds the calculation function and puts the initial computed value.
 * The 'computed' attribute should have a syntax such as 'Form filled by ${user}' where 'user' is another attribute of the model
 * @param {Schema that is sent to vue-form-builder} schema
 * @param {Model that is sent to vue-form-builder} model
 * TODO: the calculation of the computed files should be done/cross check on the server side as well
 * TODO: avoid recursive templating e.g. '${sameField}' in the computed attribute of the 'sameField' field
 */
export const prepareForm = (schema, model) => {
  if (!schema) return
  // Prepares one field marked as 'computed'
  const prepareField = field => {
    field.get = function (m) {
      const value = template(field.computed)(m)
      try {
        m[field.model] = JSON.parse(value)
      } catch (e) {
        m[field.model] = value
      }
      return value
    }
    field.readonly = true
    model[field.model] = field.get(model)
  }
  // Prepares a set of fields
  const prepareFields = fields =>
    fields &&
    fields.filter(field => field.computed).map(field => prepareField(field))
  // Maps the fields in the schema that are not part of any group
  prepareFields(schema.fields)
  // Maps the fields of each group
  schema.groups && schema.groups.map(group => prepareFields(group.fields))
}

export default ({ app, router, Vue, store }) => {
  Vue.use(VueFormGenerator)
}
