const path = require('path'),
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  compression = require('compression'),
  port = process.env.PORT || 80

const app = express()

app.use(history())
app.use(compression())
app.use(serveStatic(path.join(__dirname, '/pwa-mat')))
// app.get(function (req, res, next) {
//   res.setHeader('Set-Cookie', process.env.APP_CONF)
//   next()
// })
app.get('/config', function (req, res) {
  console.log(process.env.APP_CONF)
  const { config } = JSON.parse(process.env.APP_CONF)
  res.send(config)
})
app.listen(port)
console.log(`Server running on port ${port}`)
