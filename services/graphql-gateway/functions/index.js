// TODO: workaround to proxy file upload, until mergeShemas allows multipart upload
// npm remove --save xlsx jsonwebtoken
var XLSX = require('xlsx')

const {
  streamToBuffer,
  xlsFormLineToFormGeneratorField,
  getDecodedJWT,
  hasRole
} = require('../helpers')

const resolvers = mergeInfo => ({
  Mutation: {
    async importXlsForms (parent, { file }, context, info) {
      const token = getDecodedJWT(context)
      if (!hasRole(token, 'admin')) {
        throw Error(
          'You must be an authenticated admin to perfomr this operation'
        )
      }
      const { createReadStream, filename, mimetype } = await file
      if (
        mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        throw Error(`Wrong mimetype: ${mimetype}`)
      }
      const stream = createReadStream()
      let buffer = await streamToBuffer(stream)
      var workbook = XLSX.read(buffer, { type: 'buffer' })
      const {
        survey,
        choices,
        settings //, dictionary
      } = workbook.SheetNames.reduce((acc, curr) => {
        acc[curr] = XLSX.utils.sheet_to_json(workbook.Sheets[curr], {
          blankrows: false
        })
        return acc
      }, {})
      let forms = {}
      const DEFAULT_GROUP = {
        name: '_default',
        label: 'Main group'
      }
      let group = DEFAULT_GROUP
      for (let line of survey) {
        if (line.type && line.type !== '') {
          if (line.type === 'begin group') {
            group = {
              name: line.name || line.label,
              legend: line.label
            }
          } else if (line.type === 'end group') {
            group = DEFAULT_GROUP
          } else {
            let id = line.form_id || '_default' // Checks for which form the line is. Default if none
            forms[id] || (forms[id] = {}) // Creates the initial form if it doesn't exist yet
            // TODO: handle wrong values
            let scope = line.scope || 'encounter' // default scope: encounter
            forms[id][scope] || (forms[id][scope] = {})
            forms[id][scope].groups || (forms[id][scope].groups = [])
            let groupIndex = forms[id][scope].groups.findIndex(
              el => el.name === group.name
            )
            groupIndex >= 0 ||
              (groupIndex =
                forms[id][scope].groups.push({ ...group, fields: [] }) - 1)
            // console.log(forms[id][scope].groups[groupIndex])
            forms[id][scope].groups[groupIndex].fields.push(
              xlsFormLineToFormGeneratorField(line, choices)
            ) // Push the line/field to the right place
          }
        }
      }
      for (let line of settings) {
        if (forms[line.form_id]) {
          forms[line.form_id].title = line.form_title
          // TODO: public_key, submission_url, default_language, version, xyz?
        }
      }
      return {
        status: 'success',
        message: `${filename} has been successfully imported`,
        content: forms
      }
    }
  }
})

module.exports = { resolvers }
