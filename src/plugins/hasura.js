import gql from 'graphql-tag'
import { fragments, mutations, settings } from 'plugins/platyplus'

export const upsertMutation = (apollo, table, form) => {
  let mutation, params
  if (form.id) {
    mutation = mutations[`${table}`].update
    params = mutation.definitions
      .find(item => item.kind === 'OperationDefinition')
      .variableDefinitions.map(item => item.variable.name.value)
      .reduce((aggr, key) => {
        aggr[key] = form[key]
        return aggr
      }, {})
  } else {
    mutation = mutations[table].insert
    params = { objects: [form] }
  }
  return apollo
    .mutate({
      mutation,
      variables: {
        ...params
      }
    })
    .then(({ data }) => data[Object.keys(data)[0]].returning[0])
    .catch(error => {
      console.warn('TODO: erreur')
      console.error(error)
    })
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
export default ({ app, router, Vue }) => {}
