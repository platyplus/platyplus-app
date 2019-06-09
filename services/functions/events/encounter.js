const gql = require('graphql-tag'),
  { print } = require('graphql/language/printer'),
  { graphql, rest } = require('@bit/platyplus.backend.hasura-client'),
  { getOldNew, generateRules, ALL } = require('./helpers')

const ENCOUTER_DATE_FIELD = 'created_at' // TODO: not the ideal field

/*
const ENTITY_TYPE_SCHEMA_FROM_ENTITY = print(gql`
  query entityTypeSchema($id: uuid!) {
    entity(where: { id: { _eq: $id } }) {
      type {
        schema
      }
    }
  }
`)
*/

const STATES_FROM_ENTITY = print(gql`
  query entityStates($id: uuid!, $encounter_date: timestamptz!) {
    entity(where: { id: { _eq: $id } }) {
      states(
        where: {
          _and: [
            { date_start: { _lte: $encounter_date } }
            { date_end: { _gt: $encounter_date } }
          ]
        }
      ) {
        id
        stage {
          id
          schema
        }
        date_start
        date_end
      }
    }
  }
`)

/*
const UPDATE_ENTITY_ATTRIBUTES = print(gql`
  mutation updateEntityAttributes($id: uuid!, $attributes: jsonb!) {
    update_entity(
      where: { id: { _eq: $id } }
      _set: { attributes: $attributes }
    ) {
      affected_rows
    }
  }
`)
*/

const UPDATE_STATE_DATA = print(gql`
  mutation updateStateData($id: uuid!, $data: jsonb!) {
    update_state(where: { id: { _eq: $id } }, _set: { data: $data }) {
      affected_rows
    }
  }
`)

/*
const SQL_AGGREGATE_ENTITY_DATA = (id, rules) =>
  `select jsonb_build_object( ${rules} ) as data
  from (
    select entity_id, data
    from encounter
    where entity_id = '${id}'
    order by ${ENCOUTER_DATE_FIELD} asc) as ordered_encounter
  group by entity_id
  `
*/

// TODO: code a SQL function, and expose through Hasura schema?
// TODO: but then is it possible to map with the good rowtype?
const SQL_AGGREGATE_STATE_DATA = (entityId, dateStart, dateEnd, rules) =>
  `select jsonb_build_object( ${rules} ) as data
  from (
    select entity_id, data
    from encounter
    where entity_id = '${entityId}' and ${ENCOUTER_DATE_FIELD} >= '${dateStart}' and ${ENCOUTER_DATE_FIELD} < '${dateEnd}'
    order by created_at asc ) as ordered_encounter
  group by entity_id`

/**
 * Updates the entity attributes from its encounters data
 * @param {*} ctx
 */
/*
const updateEntityAttributes = async ctx => {
  const {
    event: { data }
  } = ctx.request.body
  for (const oldNew of getOldNew(ctx, ['entity_id'])) {
    const id = data[oldNew].entity_id
    // Gets the schema from the entity type
    const { entity } = await graphql.request(ENTITY_TYPE_SCHEMA_FROM_ENTITY, {
      id
    })
    const schema = entity[0].type.schema // TODO: abort if (although abnormal) there is no type or no schema
    const rules = generateRules(schema)
    // Calculates the entity data from the rules
    const {
      data: { result }
    } = await rest.post('', {
      type: 'run_sql',
      args: { sql: SQL_AGGREGATE_ENTITY_DATA(id, rules) }
    })
    // Updates the entity attributes
    await graphql.request(UPDATE_ENTITY_ATTRIBUTES, {
      id,
      attributes: JSON.parse(result[1][0])
    })
  }
} */

/**
 * Updates the data of every state that includes the encounter (old and new date, old and new entity)
 * @param {*} ctx
 */
const updateStageData = async ctx => {
  const {
    event: { data }
  } = ctx.request.body
  for (const oldNew of getOldNew(ctx, ['entity_id', ENCOUTER_DATE_FIELD])) {
    const entityId = data[oldNew].entity_id
    // Select all the states impacted by this encounter change
    const { entity } = await graphql.request(STATES_FROM_ENTITY, {
      id: entityId,
      encounter_date: data[oldNew][ENCOUTER_DATE_FIELD]
    })
    const states = entity[0].states
    // TODO: reuse this loop for a trigger on state. BE THEN CAREFULL TO AN INFINITE LOOP!!!
    for (const state of states) {
      const {
        id,
        stage: { schema }, // eslint-disable-next-line camelcase
        date_start, // eslint-disable-next-line camelcase
        date_end
      } = state
      // TODO: abort if (although abnormal) there is no type or no schema
      // TODO: get and merge the workflow schema
      const rules = generateRules(schema)
      // Selects and aggregates all the encounters of this entity that occurred during the state period
      const {
        data: { result }
      } = await rest.post('', {
        type: 'run_sql',
        args: {
          sql: SQL_AGGREGATE_STATE_DATA(entityId, date_start, date_end, rules)
        }
      })
      // Updates the state data accordingly
      await graphql.request(UPDATE_STATE_DATA, {
        id,
        data: JSON.parse(result[1][0])
      })
    }
  }
}

// TODO: Avoid infinite loop => STRICT RULE NOT TO UPDATE THE RECORD OF THE EVENT (or find a workaround)
// TODO: to consider: then for encounter: on create: check if one entity exists. if not, create one. It will then trigger an update
// TODO: then on update and on delete, update the entity attributes (still check if entity_id exists)
module.exports = ALL(async ctx => {
  // await updateEntityAttributes(ctx)
  await updateStageData(ctx)
  // TODO: updateWorkflowData
})
