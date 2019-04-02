const { ALL } = require('./helpers'),
  graphqlQueries = require('../graphqlQueries'),
  sqlQueries = require('../sqlQueries'),
  { graphql, rest } = require('../clients')

/**
 * Updates the entity attributes from its encounters data
 * TODO: this function works but HAS TO BE TESTED EXTENSIVELY
 * @param {*} ctx
 */
// TODO: to consider: then for encounter: on create: check if one entity exists. if not, create one. It will then trigger an update
// TODO: then on update and on delete, update the entity attributes (still check if entity_id exists)
const updateEntityAttributes = async ctx => {
  const {
    event: { data }
  } = ctx.request.body
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
module.exports = ALL(updateEntityAttributes)
