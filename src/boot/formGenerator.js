import * as SurveyVue from 'survey-vue'
import cloneDeep from 'lodash/cloneDeep'
import jexl from 'jexl'

/**
 * Converts a template-like string to an expression that can be evaluated by Jexl
 * For instance:
 * var mystring = '${name} is ${age+1} years old'
 * templateStringToExpression(mystring) // returns '"" + (name) + " is " + (age+1) + " years old"'
 * @param {String} string
 */
// TODO still usefull with surveyjs?
// TODO use handlebars
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
 // TODO some fields are still not r/o
 */
// TODO still usefull with surveyjs?
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
 */
// TODO still usefull with surveyjs? needs at least a revision
// TODO: the calculation of the computed files should be done/cross checked on the server side as well
// TODO: prevent recursive templating e.g. '${sameField}' in the computed attribute of the 'sameField' field
export const prepareForm = (schema, model) => {
  if (!schema) return
  // Prepares one field marked as 'computed'
  const prepareComputedField = field => {
    field.get = function (m) {
      const strCondition = templateStringToExpression(field.computed)
      let result = jexl.evalSync(strCondition, model)
      try {
        result = JSON.parse(result)
      } catch (e) {
        console.error(e)
      }
      m[field.model] = result
      return result
    }
    field.readonly = true
    model[field.model] = field.get(model) // loads the initial value
  }
  // Prepares one field visibility
  const prepareFiedVisibility = field => {
    let initial = field.visible
    field.visible = function (m) {
      try {
        const strCondition = templateStringToExpression(initial)
        return JSON.parse(jexl.evalSync(strCondition, m))
      } catch (e) {
        console.error(e)
        return true
      }
    }
  }
  // Prepares a set of fields
  const prepareFields = fields => {
    if (fields) {
      for (let field of fields) {
        field.computed && prepareComputedField(field)
        typeof field.visible === 'string' && prepareFiedVisibility(field)
      }
    }
  }
  // Prepares the fields in the schema that are not part of any group
  prepareFields(schema.fields)
  if (schema.groups) {
    // Prepares the fields of each group
    for (let group of schema.groups) {
      prepareFields(group.fields)
    }
  }
}

export default ({ app, router, Vue, store }) => {
  Vue.use(SurveyVue)
}
