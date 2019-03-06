// TODO: create a dedicated NPM package
const streamToBuffer = stream =>
  new Promise((resolve, reject) => {
    let data = []
    stream
      .on('error', reject)
      .on('data', chunk => {
        data.push(chunk)
      })
      .on('end', () => {
        let buffer = Buffer.concat(data)
        return resolve(buffer)
      })
  })

const streamToString = stream =>
  new Promise((resolve, reject) => {
    let data = ''
    stream
      .on('error', reject)
      .on('data', chunk => {
        data += chunk
      })
      .on('end', () => resolve(data))
  })

/** Generates select options according to http://xlsform.org/en/#multiple-choice-questions  */
const pickChoices = (listName, choices) => {
  try {
    return choices
      .filter(choice => choice.list_name === listName)
      .map(choice => ({ id: choice.name, name: choice.label }))
  } catch (e) {
    return []
  }
}

/**
 * Converts xlsform range parameters into vue form generator attributes
 * @param {Object} parameters as per the specifications in http://xlsform.org/en/#range
 * @returns {Object} the range attributes of a Vue Form Generator field
 */
const getRangeParameters = parameters => {
  let params = {}
  try {
    for (let pair of parameters.split(' ')) {
      let keyValue = pair.split('=')
      keyValue[1] && (params[keyValue[0]] = keyValue[1])
    }
    return {
      min: parseInt(params.start) || 10,
      max: parseInt(params.end) || 100,
      step: parseInt(parameters.step) || 1
    }
  } catch (e) {
    return {}
  }
}

const fieldSpecs = (line, choices) => {
  const typeArgs = line.type.split(' ') // Splits the type in case type has some arguments
  return {
    integer: () => ({ type: 'input', inputType: 'number' }),
    decimal: () => ({ type: 'input', inputType: 'number' }),
    range: () => ({ type: 'slider', ...getRangeParameters(line.parameters) }),
    text: () => ({ type: 'input', inputType: 'text' }),
    select_one: () => ({
      type: 'select',
      values: pickChoices(typeArgs[1], choices)
    }),
    select_multiple: () => ({
      type: 'vueMultiSelect',
      values: pickChoices(typeArgs[1], choices)
    }),
    rank: () => ({}),
    note: () => ({ type: 'label' }),
    geopoint: () => ({}),
    geotrace: () => ({}),
    geoshape: () => ({}),
    date: () => ({ type: 'dateTimePicker' }),
    time: () => ({ type: 'dateTimePicker' }),
    dateTime: () => ({ type: 'dateTimePicker' }),
    image: () => ({}),
    audio: () => ({}),
    video: () => ({}),
    file: () => ({}),
    barcode: () => ({}),
    calculate: () => ({
      type: 'input',
      inputType: 'text', // TODO: discutable
      computed: line.calculation
    }),
    acknowledge: () => ({}),
    hidden: () => ({ type: 'input', inputType: 'hidden' }),
    'xml-external': () => ({})
  }[typeArgs[0]]()
}

const xlsFormLineToFormGeneratorField = (line, choices) => {
  // TODO: convertir en jexl https://opendatakit.github.io/xforms-spec/#xpath-functions
  const result = {
    model: line.name,
    label: line.label,
    ...fieldSpecs(line, choices)
  }
  line.hint && (result.hint = line.hint)
  line.required && line.required === 'yes' && (result.required = true)
  line.read_only && line.read_only === 'yes' && (result.readonly = true)
  line.relevant && (result.visible = line.relevant)
  return result
}

/**
 * Looks for a JWT in the Authorization header of the request,
 * and returns it after it has been decoded with the public key and its algorithm
 * @param {Http Request} req
 * @returns {Object} the decoded JWT
 */
const jwt = require('jsonwebtoken')
const getDecodedJWT = req => {
  try {
    const Authorization = req.headers.authorization
    const token = Authorization.replace('Bearer ', '')
    return jwt.verify(token, process.env.PUBLIC_KEY.replace(/\\n/g, '\n'), {
      algorithms: [process.env.ALGORITHM || 'RS256']
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

const hasRole = (decodedJWT, role) => {
  try {
    const roles =
      decodedJWT['https://hasura.io/jwt/claims']['x-hasura-allowed-roles']
    return roles.includes(role)
  } catch (e) {
    return false
  }
}

module.exports = {
  streamToBuffer,
  streamToString,
  xlsFormLineToFormGeneratorField,
  getDecodedJWT,
  hasRole
}
