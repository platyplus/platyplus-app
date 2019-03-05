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
const pickChoices = (typeArgs, choices) =>
  choices
    .filter(choice => choice.list_name === typeArgs[1])
    .map(choice => ({ id: choice.name, name: choice.label }))

/** get range parameters according to http://xlsform.org/en/#range  */
const getRangeParameters = parameters => {
  let params = {}
  for (let pair of parameters.split(' ')) {
    let keyValue = pair.split('=')
    keyValue[1] && (params[keyValue[0]] = keyValue[1])
  }
  return {
    min: parseInt(params.start) || 10,
    max: parseInt(params.end) || 100,
    step: parseInt(parameters.step) || 1
  }
}

const xlsFormLineToFormGeneratorField = (line, choices) => {
  const typeArgs = line.type.split(' ') // Splits the type in case type has some arguments
  const specs = {
    integer: { type: 'input', inputType: 'number' },
    decimal: { type: 'input', inputType: 'number' },
    range: { type: 'slider', ...getRangeParameters(line.parameters) },
    text: { type: 'input', inputType: 'text' },
    select_one: {
      type: 'select',
      values: pickChoices(typeArgs, choices)
    },
    select_multiple: {
      type: 'vueMultiSelect',
      values: pickChoices(typeArgs, choices)
    },
    rank: {},
    note: { type: 'label' },
    geopoint: {},
    geotrace: {},
    geoshape: {},
    date: { type: 'dateTimePicker' },
    time: { type: 'dateTimePicker' },
    dateTime: { type: 'dateTimePicker' },
    image: {},
    audio: {},
    video: {},
    file: { type: 'input', inputType: 'file' },
    barcode: {},
    calculate: {},
    acknowledge: {},
    hidden: { type: 'input', inputType: 'hidden' },
    'xml-external': {}
  }[typeArgs[0]]
  return {
    model: line.name,
    label: line.label || line.name,
    ...specs
  }
}

module.exports = {
  streamToBuffer,
  streamToString,
  xlsFormLineToFormGeneratorField
}
