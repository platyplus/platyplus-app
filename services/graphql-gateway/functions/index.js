// TODO: workaround to proxy file upload, until mergeShemas allows multipart upload
// npm remove --save xlsx
var XLSX = require('xlsx')

const {
  streamToBuffer,
  xlsFormLineToFormGeneratorField
} = require('../helpers')

const resolvers = mergeInfo => ({
  Mutation: {
    async importXlsForms (parent, { file }, context, info) {
      const { createReadStream, filename, mimetype } = await file
      if (
        mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const stream = createReadStream()
        let buffer = await streamToBuffer(stream)
        var workbook = XLSX.read(buffer, { type: 'buffer' })
        const {
          survey,
          choices,
          settings
          // dictionary
        } = workbook.SheetNames.reduce((acc, curr) => {
          acc[curr] = XLSX.utils.sheet_to_json(workbook.Sheets[curr], {
            blankrows: false
            // defval: ''
          })
          return acc
        }, {})
        let forms = {}
        for (let line of survey) {
          if (line.name && line.name !== '') {
            let id = line.form_id || 'default' // Check for which form the line is. Default if none
            if (!forms[id]) {
              // Creates the initial form if it doesn't exist yet
              forms[id] = { attribute: [], encounter: [], state: [] } // One array of lines/fields for each of the three scopes
            }
            // TODO: handle wrong values
            let scope = line.scope || 'encounter' // default scope: encounter
            forms[id][scope].push(
              xlsFormLineToFormGeneratorField(line, choices)
            ) // Push the line/field to the right place
          }
        }
        for (let line of settings) {
          if (forms[line.form_id]) {
            forms[line.form_id].title = line.form_title
            // TODO: public_key, submission_url, default_language, version, xyz?
          }
        }
        console.log('Forms')
        console.log(JSON.stringify(forms, null, 2))
        return {
          status: 'success',
          message: `${filename} has been successfully imported`
        }
      } else {
        throw Error(`Wrong mimetype: ${mimetype}`)
        // return { status: 'error', message: `Wrong mimetype: ${mimetype}` }
      }
    }
  }
})

module.exports = { resolvers }
