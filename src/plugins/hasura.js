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
  fragment = 'base'
}) => {
  const mutation = mutations[table].update
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
  return Promise.all(theloop)
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
  const next = options.beforeSave({
    newValues,
    oldValues,
    relations
  }).newValues
  if (oldValues.id) {
    for await (const name of Object.keys(options.relations)) {
      let relation = options.relations[name]
      let data = relations[name]
      let initialData = oldValues[name].map(item => item[relation.to].id)
      const newData = data
        .filter(item => !initialData.includes(item))
        .map(item => ({
          [`${table}_id`]: oldValues.id,
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
    return upsertMutation({
      apollo,
      table,
      fragment: options.fragment,
      data: next
    })
  } else {
    console.warn('TODO: add relations')
    console.warn('TODO: return query')
    return upsertMutation({
      apollo,
      table,
      data: next
    })
  }
}
export default ({ app, router, Vue }) => {}
