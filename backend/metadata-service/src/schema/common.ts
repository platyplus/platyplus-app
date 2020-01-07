import { Context } from 'koa'

import { ObjectMap } from '../core'

import { ColumnAction } from './rules'

export type NodeScope = 'id' | 'column' | 'deep'

export interface GraphQLNode {
  toObject(context: Context, action: ColumnAction, scope?: NodeScope): ObjectMap
}
