// TODO: workaround to proxy file upload, until mergeShemas allows multipart upload
// npm remove --save xlsx
var XLSX = require('xlsx')

const { streamToBuffer } = require('../helpers')

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
        console.log(workbook)
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
