const path = require('path'),
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  compression = require('compression')

const app = express()

app.get('/config', function (req, res) {
  res.send({
    API: process.env.API
  })
})
app.use(history())
app.use(compression())
app.use(serveStatic(path.join(__dirname, '/pwa-mat')))

module.exports = app
