import { mutations, settings } from 'plugins/platyplus'

const variableValues = (mutation, data) =>
  mutation.definitions
    .find(item => item.kind === 'OperationDefinition')
    .variableDefinitions.map(item => item.variable.name.value)
    .reduce((aggr, key) => {
      aggr[key] = data[key]
      return aggr
    }, {})

// TODO: merge the three functions below
export const upsertMutation = async ({
  apollo,
  table,
  data,
  insert = 'insert',
  update = 'update'
}) => {
  const isUpdate = Boolean(Array.isArray(data) ? data[0].id : data.id)
  return isUpdate
    ? updateMutation({ apollo, table, data, mutation: update })
    : insertMutation({ apollo, table, data, mutation: insert })
}

export const updateMutation = async ({
  apollo,
  table,
  data,
  mutation = 'update'
}) => {
  const mutationName = mutation
  mutation = mutations[table][mutation]
  if (!mutation) {
    throw Error(
      `The '${mutationName}' mutation has to be implemented for the table '${table}'.`
    )
  }
  const objects = Array.isArray(data) ? data : [data]
  const theloop = objects.map(item => {
    const variables = variableValues(mutation, data)
    variables.id = item.id
    return apollo.mutate({ mutation, variables }).then(({ data }) => {
      if (!data.result) {
        throw Error(
          `The mutation '${mutationName}' on the table '${table}' has no sub-mutation or sub-query alias as 'result'. Alias one of the sub-mutation with the prefix 'result: '.`
        )
      }
      return data.result.returning[0]
    })
  })
  const res = await Promise.all(theloop)
  return Array.isArray(data) ? res : res[0]
}

export const insertMutation = async ({
  apollo,
  table,
  data,
  mutation = 'insert'
}) => {
  if (Array.isArray(data)) {
    throw Error('insertMutation is not fit for multiple insert anymore!!!')
  }
  if (!mutations[table].insert) {
    throw Error(
      `The '${mutation}' mutation has to be implemented for the table '${table}'`
    )
  }
  mutation = mutations[table][mutation]
  const variables = variableValues(mutation, data)
  return apollo
    .mutate({ mutation, variables })
    .then(({ data }) => data[Object.keys(data)[0]].returning[0]) // TODO: meh: depend de la mutation
}

export const deleteMutation = ({ apollo, table, key, data }) => {
  const field = !key || key === 'id' ? 'id' : `${key}_id`
  const ids = Array.isArray(data) ? data : [data]
  if (ids.length) {
    const mutation = mutations[table].delete
    if (!mutation) {
      throw Error(
        `The 'delete' mutation has to be implemented for the table '${table}'`
      )
    }
    return apollo.mutate({
      mutation,
      variables: { where: { [field]: { _in: ids } } }
    })
  }
}

export const addedRelations = (
  table,
  selfId,
  relation,
  before = [],
  afterIds
) => {
  const beforeIds = before.map(item => item[relation.to].id)
  return afterIds
    .filter(item => !beforeIds.includes(item))
    .map(item => {
      let res = { [`${relation.to}_id`]: item }
      if (selfId) res[`${relation.from || table}_id`] = selfId
      return res
    })
}

export const removedRelations = (relation, before = [], afterIds) =>
  before
    .map(item => item[relation.to].id)
    .filter(item => !afterIds.includes(item))

export const save = async (
  {
    apollo,
    table,
    oldValues = {},
    newValues,
    relations,
    insert = 'insert',
    update = 'update'
  }, // TODO: define relations as part of newValues?
  options = {}
) => {
  options = Object.assign(
    {
      // TODO: default update and insert mutations?
      relations: {},
      beforeSave: p => p
    },
    settings[table],
    options
  )
  newValues = options.beforeSave({
    newValues,
    oldValues,
    relations
  }).newValues
  // TODO: options stored somewhere else than the form value?
  // TODO: -> make a distring 'cleanForm' function to make it clear no matter where it is called
  const relationsVariables = Object.keys(options.relations).reduce(
    (aggr, relation) => {
      aggr[`${relation}_add`] = addedRelations(
        table,
        oldValues.id,
        options.relations[relation],
        oldValues[relation],
        relations[relation]
      )
      aggr[`${relation}_remove`] = removedRelations(
        options.relations[relation],
        oldValues[relation],
        relations[relation]
      )
      return aggr
    },
    {}
  )
  return upsertMutation({
    apollo,
    table,
    insert,
    update,
    data: Object.assign(newValues, relationsVariables)
  })
}
export default ({ app, router, Vue }) => {}
