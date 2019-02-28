import { mutations, settings } from 'plugins/platyplus'

/**
 * Filters the atributes in the data according to the definitions of the mutation
 * @param {GraphQL mutation} mutation the GraphQL mutation
 * @param {Object} data The initial, unfiltered ata object
 * @returns {Object} Object with only the right attributes and ready to be used as variables for the mutation
 */
const variableValues = (mutation, data) =>
  mutation.definitions
    .find(item => item.kind === 'OperationDefinition')
    .variableDefinitions.map(item => item.variable.name.value)
    .reduce((aggr, key) => {
      aggr[key] = data[key]
      return aggr
    }, {})

export const upsertMutation = async ({
  apollo,
  table,
  data,
  insert = 'insert',
  update = 'update'
}) => {
  const isUpdate = Boolean(Array.isArray(data) ? data[0].id : data.id)
  const mutationName = isUpdate ? update : insert
  const mutation = mutations[table][mutationName]
  if (!mutation) {
    throw Error(
      `The '${mutationName}' mutation has to be implemented for the table '${table}'.`
    )
  }
  const objects = Array.isArray(data) ? data : [data]
  const loop = objects.map(item => {
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
  const res = await Promise.all(loop)
  return Array.isArray(data) ? res : res[0]
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

/**
 * Looks for new relations that could have been added after a modification of a form
 * @param {String} table Table name
 * @param {String} selfId UUID of the object owning the relations
 * @param {Object} relation Relations' settings
 * @param {Array<Object>} before List of initial relations before modification
 * @param {Array<String>} afterIds List of current IDs selected as the whole new set of relations
 * @returns {Array<Object>} The new relations that were not part of the initial set and that should be added in the database
 */
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
/**
 * Looks for relations to be deleted after modifying a form
 * @param {Object} relation Relations' settings
 * @param {Array<Object>} before List of initial relations before modification
 * @param {Array<String>} afterIds List of current IDs selected as the whole new set of relations
 * @returns {Array<String>} The UUIDs of the relations to be removed from the database
 */
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
