import VueFormGenerator from 'vue-form-generator'
import cloneDeep from 'lodash/cloneDeep'
import template from 'lodash/template'
import 'vue-form-generator/dist/vfg.css'

/**
 * Converts a template-like string to an expression that can be evaluated by Jexl
 * For instance:
 * var mystring = '${name} is ${age+1} years old'
 * templateStringToExpression(mystring) // returns '"" + (name) + " is " + (age+1) + " years old"'
 * @param {String} string
 */
export const templateStringToExpression = string => {
  var expressions = string.match(/\$\{(.*?)\}/g)
  if (expressions) {
    for (let expression of expressions) {
      let value = expression.substring(2, expression.length - 1)
      string = string.split(expression).join(`" + (${value}) + "`)
    }
  }
  return `"${string}"`
}

/**
 * Generates a new schema that locks all the fields against modification
 * @param {the initial schema with the vue-form-builder syntax} schema
 * @returns a clone of the initial schema with all fields marked as read-only
 * TODO: some fields are still not r/o
 */
export const makeReadOnly = schema => {
  if (!schema) return
  /** Small function that makes readonly each field of a field set.
   * @param {Array<Object>} fields An array of fields */
  const roFields = fields => {
    if (fields) {
      return fields.map(field => {
        field.readonly = true
        return field
      })
    } else return fields
  }
  let res = cloneDeep(schema) // TODO: Not really needed to deep clone. Maybe Object.assign would be enough
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
 * TODO: number calculation by default, string computing are escaped e.g. computed = '"string ${fieldName}"'
 * TODO: the calculation of the computed files should be done/cross checked on the server side as well
 * TODO: prevent recursive templating e.g. '${sameField}' in the computed attribute of the 'sameField' field
 * TODO: transform visible attribute into a function
 * TODO: use https://github.com/TomFrost/Jexl - probably safer than lodash templates
 */
export const prepareForm = (schema, model) => {
  if (!schema) return
  // Prepares one field marked as 'computed'
  const prepareField = field => {
    field.get = function (m) {
      // TODO: replace by Jexl and templateStringToExpression
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
