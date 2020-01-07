/* eslint-disable @typescript-eslint/class-name-casing */
declare module 'pg-query-parser' {
  export function parse(query: any): any

  type OperationTypes =
    | Const
    | TypeCast
    | FuncCall
    | Expression
    | ColumnReference
    | BooleanExpression
    | NullTest

  interface GenericExpression {
    location: string
  }
  interface GenericValue<Int, Str, Null> {
    Integer?: {
      ival: Int
    }
    String?: {
      str: Str
    }
    Null?: Null
  }
  type Value = GenericValue<number, string, {}>
  type GenericStringValue<T> = Required<
    Pick<GenericValue<number, T, {}>, 'String'>
  >
  type StringValue = GenericStringValue<string>

  type castTypes = 'bool' | 'text' | 'json' | 'jsonb' // TODO complete
  interface TypeCast {
    arg: Operation
    typeName: {
      TypeName: {
        names: GenericStringValue<'pg_catalog' | castTypes>[]
      }
    }
  }
  interface Const extends GenericExpression {
    val: Value
  }
  interface FuncCall extends GenericExpression {
    funcname: StringValue[]
    args?: Operation[]
  }
  interface Expression extends GenericExpression {
    kind: number // ? convert to enum to get some semantics
    name: StringValue[]
    lexpr: Operation
    rexpr: Operation
  }
  interface ColumnReference extends GenericExpression {
    fields: StringValue[]
  }
  enum BooleanOperation {
    AND = 0,
    OR = 1,
    NOT = 2
  }
  interface BooleanExpression extends GenericExpression {
    boolop: BooleanOperation
    args: Operation[]
  }
  interface NullTest extends GenericExpression {
    nulltesttype: number // 0 = is null, 1 = is not null
    arg: Operation
  }
  interface Operation {
    TypeCast?: TypeCast
    A_Const?: Const
    FuncCall?: FuncCall
    A_Expr?: Expression
    BoolExpr?: BooleanExpression
    ColumnRef?: ColumnReference
    NullTest?: NullTest
  }
}
