const Koa = require('koa'),
  Router = require('koa-router'),
  bodyParser = require('koa-bodyparser')
// PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')

// { GraphQLClient } = require('graphql-request')
// const graphql = new GraphQLClient(process.env.HASURA_URL, {
//   headers: {
//     'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
//   }
// })

var knex = require('knex')({
  client: 'pg',
  connection: process.env.POSTGRES_URL,
  searchPath: 'public',
  pool: { min: 0, max: 7 }
})

const switchAction = ctx => {
  // const { event: { op, data }, table: { schema, name } } = ctx.request.body
  const {
    table: { name }
  } = ctx.request.body
  /** TODO:
   * 1. Get the entity. If none exists, create one or abort?
   * 2. Get the aggregation parameters from the entity type
   * 3. Build the SQL query from the aggregation params
   * 4. Run the Knex query, and insert the result into the entity
   * @param {*} ctx
   */
  const encounter = async ctx => {
    const request = `select entity_id, jsonb_build_object('skills', first((data->>'skills')::text) ) as data
      from encounter
      group by entity_id
    ` // TODO: order by
    const { rows } = await knex.raw(request)
    for (const row of rows) {
      console.log(JSON.stringify(row.data))
    }
  }
  const defaultAction = async ctx => {
    console.log('TODO: default')
  }
  const actions = { encounter, defaultAction }
  return (actions[name] || actions.defaultAction)()
}

const events = async ctx => {
  await switchAction(ctx)
  ctx.body = 'ok'
}

const app = new Koa()
const router = new Router()
app.use(bodyParser())

router.post('/events', events)
router.get('/healthcheck', ctx => {
  ctx.body = 'ok'
})
app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
