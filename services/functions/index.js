const Koa = require('koa'),
  Router = require('koa-router'),
  bodyParser = require('koa-bodyparser'),
  events = require('./events')

const eventOptions = async ctx => {
  const {
    table: { name },
    event: { op }
  } = ctx.request.body
  await (events[name] || events.defaultAction)[op](ctx)
  ctx.body = 'ok'
}

const app = new Koa()
const router = new Router()
app.use(bodyParser())

router.post('/events', eventOptions)
router.get('/healthcheck', ctx => {
  ctx.body = 'ok'
})
app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
