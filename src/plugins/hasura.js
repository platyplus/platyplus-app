import gql from 'graphql-tag'
import { fragments, mutations, settings } from 'plugins/platyplus'

export const upsertMutation = async ({
  apollo,
  table,
  data,
  fragment = 'base'
}) => {
  const update = Boolean(Array.isArray(data) ? data[0].id : data.id)
  return update
    ? updateMutation({ apollo, table, data, fragment })
    : insertMutation({ apollo, table, data, fragment })
}

export const updateMutation = async ({
  apollo,
  table,
  data,
  fragment = 'base',
  mutation = 'update'
}) => {
  mutation = mutations[table][mutation]
  const objects = Array.isArray(data) ? data : [data]
  const theloop = objects.map(item => {
    const params = mutation.definitions
      .find(item => item.kind === 'OperationDefinition')
      .variableDefinitions.map(item => item.variable.name.value)
      .reduce((aggr, key) => {
        aggr[key] = data[key]
        return aggr
      }, {})
    return apollo
      .mutate({ mutation, variables: { ...params, id: item.id } })
      .then(({ data }) => data[Object.keys(data)[0]].returning[0])
  })
  const res = await Promise.all(theloop)
  return Array.isArray(data) ? res : res[0]
}

export const insertMutation = async ({
  apollo,
  table,
  data,
  fragment = 'base'
}) => {
  const objects = Array.isArray(data) ? data : [data]
  const mutation = gql`
    mutation insert_${table}($objects: [${table}_insert_input!]!) {
      insert_${table}(objects: $objects) {
        returning {
          ...${table}_${fragment}
        }
      }
    }
    ${fragments[table][fragment]}
  `
  return apollo
    .mutate({ mutation, variables: { objects } })
    .then(({ data }) => data[Object.keys(data)[0]].returning[0])
}

export const deleteMutation = ({ apollo, table, key, data }) => {
  const field = !key || key === 'id' ? 'id' : `${key}_id`
  const ids = Array.isArray(data) ? data : [data]
  if (ids.length) {
    return apollo.mutate({
      mutation: gql`
      mutation delete_${table}($ids: [ID!]!) {
        delete_${table}(where: { ${field}: { _in: $ids } }) {
          affected_rows
        }
      }
    `,
      variables: { ids }
    })
  } else {
    throw Error(`Nothing to delete on ${table}`)
  }
}

export const queryHelper = ({ table, fragment = 'base', subscription }) => {
  // TODO: split arguments into 'table' and 'options'
  const type = subscription ? 'subscription' : 'query'
  return gql`
    ${type} ${table} ($where: ${table}_bool_exp, $orderBy:[${table}_order_by]) {
      ${table}(where: $where, order_by:$orderBy) {
        ...${table}_${fragment}
      }
    }
    ${fragments[table][fragment]}
  `
}

export const smartQueryHelper = ({ table, fragment, where, orderBy }) => ({
  // TODO: split arguments into 'table' and 'options'
  query: queryHelper({ table, fragment }),
  update: data => data[Object.keys(data)[0]],
  variables: {
    where: where || settings[table].where || {},
    orderBy: orderBy || settings[table].orderBy || []
  },
  subscribeToMore: {
    document: queryHelper({ table, fragment, subscription: true }),
    updateQuery: (previousResult, { subscriptionData }) =>
      subscriptionData.data,
    variables: {
      where: where || settings[table].where || {},
      orderBy: orderBy || settings[table].orderBy || []
    }
  }
})

const upsertRelations = async (
  apollo,
  table,
  record,
  relationsSettings,
  relationsData
) => {
  for await (const name of Object.keys(relationsSettings)) {
    let relation = relationsSettings[name]
    let data = relationsData[name]
    let initialData = record[name].map(item => item[relation.to].id)
    const newData = data
      .filter(item => !initialData.includes(item))
      .map(item => ({
        [`${relation.from || table}_id`]: record.id,
        [`${relation.to}_id`]: item
      }))
    if (newData.length > 0) {
      await insertMutation({
        apollo,
        table: relation.table,
        fragment: 'minimal',
        data: newData
      })
    }
    const deletedData = initialData.filter(item => !data.includes(item))
    if (deletedData.length > 0) {
      await deleteMutation({
        apollo,
        table: relation.table,
        key: relation.to,
        data: deletedData
      })
    }
  }
}

export const save = async (
  { apollo, table, oldValues, newValues, relations },
  options = {}
) => {
  options = {
    ...{
      fragment: 'base',
      relations: {},
      beforeSave: p => p
    },
    ...settings[table],
    ...options
  }
  let next = options.beforeSave({
    newValues,
    oldValues,
    relations
  }).newValues
  // Remove the option values put in the form so we don't send them to the server
  // TODO: options stored somewhere else than the form value?
  // TODO: put the below loop in the form plugin instead?
  // TODO: -> make a distring 'cleanForm' function to make it clear no matter where it is called
  if (options.options) {
    Object.keys(options.options).map(name => {
      delete next[name]
    })
  }
  if (oldValues.id) {
    await upsertRelations(
      apollo,
      table,
      oldValues,
      options.relations,
      relations
    )
    return upsertMutation({
      apollo,
      table,
      fragment: options.fragment,
      data: next
    })
  } else {
    const result = await upsertMutation({
      apollo,
      table,
      data: next
    })
    // TODO: test upsert relations in this case (insert new record)
    await upsertRelations(apollo, table, result, options.relations, relations)
    // TODO: test return value: are the relations already in the cache,
    // or shall we query the server again and return the result?
    return result
  }
}
export default ({ app, router, Vue }) => {}
