import {
  Value,
  Operation,
  Const,
  FuncCall,
  ColumnReference,
  OperationTypes,
  BooleanExpression,
  Expression,
  NullTest
} from 'pg-query-parser'

export const valueOf = (val: Value | Value[]) => {
  const values = Array.isArray(val) ? val : [val]
  return values
    .map(value => {
      if (value.Integer) return value.Integer.ival
      else if (value.String) return value.String.str
      else if (value.Null) return null
      // TODO floats and other types
      else throw Error(`unknow constant type:\n ${JSON.stringify(value)}`)
    })
    .join('.')
}

const getOperationOfType = <T extends OperationTypes>(
  operation: Operation,
  key: keyof Operation
) =>
  (operation[key] || (operation.TypeCast && operation.TypeCast.arg[key])) as
    | T
    | undefined

export const getConst = (operation: Operation) =>
  getOperationOfType<Const>(operation, 'A_Const')
export const getColumn = (operation: Operation) =>
  getOperationOfType<ColumnReference>(operation, 'ColumnRef')
export const getFunction = (operation: Operation) =>
  getOperationOfType<FuncCall>(operation, 'FuncCall')
export const getBoolExp = (operation: Operation) =>
  getOperationOfType<BooleanExpression>(operation, 'BoolExpr')
export const getExp = (operation: Operation) =>
  getOperationOfType<Expression>(operation, 'A_Expr')
export const getNullTest = (operation: Operation) =>
  getOperationOfType<NullTest>(operation, 'NullTest')

export const typeCastFunction = (operation: Operation) => {
  // ? typecast according to a dictionnary, given specific names, for instance pg_catalog.text, pg_catalog.bool...
  // ? In this case, join the names into a full given name? or an object catalog e.g { pg_catalog: { text: ...}} ?
  if (operation.TypeCast) {
    const typeCast = operation.TypeCast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(value: any) {
      // * Pick the last type name
      const typeName = typeCast.typeName.TypeName.names.pop()
      if (typeName) {
        switch (valueOf(typeName)) {
          case 'bool':
            return value === 't'
          default:
            return value
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: any) => value
}

export const constValue = (operation: Operation) => {
  const constant = getConst(operation)
  if (constant) return typeCastFunction(operation)(valueOf(constant.val))
}

export const functionName = (operation: Operation) => {
  const func = getFunction(operation)
  if (func) return typeCastFunction(operation)(valueOf(func.funcname))
}

export const columnName = (operation: Operation) => {
  // ? What if there are multiple fields? Does it mean they represent the schema and the table name, such as [schema, table]?
  const column = getColumn(operation)
  if (column)
    return typeCastFunction(operation)(
      column.fields.map(field => valueOf(field)).join('.')
    )
}

export const expressionValue = (operation: Operation) => {
  const expression = getExp(operation)
  if (expression) return typeCastFunction(operation)(valueOf(expression.name))
}
