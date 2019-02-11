const path = require('path'),
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  compression = require('compression'),
  port = process.env.PORT || 80,
  http = require('http'),
  { createTerminus } = require('@godaddy/terminus')

const app = express()

app.get('/config', function (req, res) {
  res.send({
    API: process.env.API
  })
})
app.use(history())
app.use(compression())
app.use(serveStatic(path.join(__dirname, '/pwa-mat')))
const server = http.createServer(app)
server.listen(port)

// Health check
function onSignal () {
  console.log('server is starting cleanup')
}
function onShutdown () {
  console.log('cleanup finished, server is shutting down')
}
function healthCheck () {
  return Promise.resolve(200)
}
const terminusOptions = {
  // healthcheck options
  healthChecks: {
    '/healthcheck': healthCheck // a promise returning function indicating service health
  },
  timeout: 1000, // [optional = 1000] number of milliseconds before forcefull exiting
  onSignal, // [optional] cleanup function, returning a promise (used to be onSigterm)
  onShutdown // [optional] called right before exiting
}
createTerminus(server, terminusOptions)
console.log(`Server running on port ${port}`)
