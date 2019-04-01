const Koa = require('koa'),
  Router = require('koa-router'),
  bodyParser = require('koa-bodyparser'),
  { GraphQLClient } = require('graphql-request'),
  axios = require('axios'),
  graphqlQueries = require('./graphqlQueries'),
  sqlQueries = require('./sqlQueries')

const graphql = new GraphQLClient(
  `${process.env.HASURA_URL}/v1alpha1/graphql`,
  {
    headers: {
      'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
    }
  }
)

const rest = axios.create({
  baseURL: `${process.env.HASURA_URL}/v1/query`,
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  }
})

const switchAction = ctx => {
  // TODO: Avoid infinite loop => STRICT RULE NOT TO UPDATE THE RECORD OF THE EVENT (or find a workaround)
  // const { event: { op, data }, table: { schema, name } } = ctx.request.body
  const {
    event: { data },
    table: { name }
  } = ctx.request.body
  /**
   * Updates the entity attributes from its encounters data
   * TODO: this function works but HAS TO BE TESTED EXTENSIVELY
   * @param {*} ctx
   */
  const encounter = async ctx => {
    // Picks the entity ids from the old and the new encounters (in case the entity changed in an update)
    let entityIds = []
    for (let x in data) {
      data[x].entity_id &&
        !entityIds.includes(data[x].entity_id) &&
        entityIds.push(data[x].entity_id)
    }
    for (const id of entityIds) {
      // Gets the schema from the entity type
      const { entity } = await graphql.request(
        graphqlQueries.ENTITY_TYPE_SCHEMA_FROM_ENTITY,
        { id }
      )
      const schema = entity[0].type.schema // TODO: abort if (although abnormal) there is no type or no schema
      // Generates the aggregation rules from the schema
      const rules = []
      for (let x in schema) {
        // TODO: check the aggregation type name, and guess the value type (below: always 'text')
        rules.push(`'${x}', ${schema[x]}((data->>'${x}')::text)`)
      }
      // Calculates the entity data from the rules
      const {
        data: { result }
      } = await rest.post('', {
        type: 'run_sql',
        args: { sql: sqlQueries.SQL_AGGREGATE_ENTITY_DATA(id, rules) }
      })
      const attributes = JSON.parse(result[1][0])
      // Updates the entity attributes
      await graphql.request(graphqlQueries.UPDATE_ENTITY_ATTRIBUTES, {
        id,
        attributes
      })
    }
  }
  const undefinedTableAction = async ctx => {
    console.log('TODO: undefined table action')
  }
  const actions = { encounter, undefinedTableAction }
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
