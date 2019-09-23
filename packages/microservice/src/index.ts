import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import terminus from './terminus'

export const app = new Koa()
app.use(bodyParser())

export const router = new Router()
app.use(router.routes()).use(router.allowedMethods())

export const server = http.createServer(app.callback())

// TODO don't add terminus if on dev mode
terminus(server)

export default (port = process.env.PORT || 3000) => {
  server.listen(port, () => {
    console.log(`🚀 Server ready and listening on port ${port}`)
  })
  return { app, router, server }
}
