const AGGREGATORS = ['last'] // The default aggregation is the first value of the array

export const ALL = (func: Function) => ({
  INSERT: func,
  UPDATE: func,
  DELETE: func
})

/**
 * Checks which records (the old one, the new one or both) according to the type of the operation
 * @param {[String]} compareFields
 * @returns ['old'] for DELETE, ['new'] for INSERT, ['old','new'] for UPDATE with changes in the compareFields, ['new'] for UPDATE with no changes
 */
export const getOldNew = (ctx: any, compareFields: string[] = []) => {
  const {
    event: { data },
    event: { op }
  } = ctx.request.body
  if (op === 'INSERT') return ['new']
  if (op === 'DELETE') return ['old']
  for (const field of compareFields) {
    if (data.old[field] !== data.new[field]) return ['old', 'new']
  }
  return ['new']
}

export const generateRules = (
  schema: { [key: string]: any },
  aggregators = AGGREGATORS
) => {
  // Generates the aggregation rules from the schema
  const rules = []
  for (const x in schema) {
    // do not include if by any chance the field x equals false
    if (schema[x]) {
      const aggregator = aggregators.includes(schema[x])
        ? schema[x]
        : aggregators[0]
      rules.push(`'${x}', ${aggregator}((data->>'${x}')::text)`)
    }
  }
  return rules.join(', ')
}
