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

module.exports = {
  streamToBuffer,
  streamToString
}
