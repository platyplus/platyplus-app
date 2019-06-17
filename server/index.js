const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const serveStatic = require('koa-static')
const history = require('koa-history-api-fallback')

const app = new Koa()
const router = new Router()

app.use(bodyParser())
router.get('/config', function (req, res) {
  res.send({
    API: process.env.API
  })
})
app.use(router.routes()).use(router.allowedMethods())
app.use(serveStatic(path.join(__dirname, '/pwa-mat')))

app.use(history())

module.exports = app
