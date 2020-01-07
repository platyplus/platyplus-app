import { Field, ObjectType } from 'type-graphql'

import { getHandlebarsVars } from '../helpers'

import { Table } from './table'
import { GraphQLNode } from './common'
import { ObjectMap } from '../core'
import { set } from 'object-path'

@ObjectType({ description: '' })
export class Label implements GraphQLNode {
  table: Table
  constructor(table: Table) {
    // ? throw an error if the fields required for the label are not allowed as per the select permission?
    this.table = table
  }

  private _template: string
  @Field(type => String)
  get template() {
    if (!this._template) {
      // TODO implement custom templates in the settings table
      if (this.table.columns.find(column => column.name === 'name'))
        this._template = '<%= name %>'
      else {
        const ids = this.table.idFields.map(column => column.name)
        if (ids.length) this._template = `<%= ${ids.join(' %>.<% ')} %>`
        else this._template = 'undefined label template'
      }
    }
    return this._template
  }

  get requirements() {
    // TODO get rid of this: the implementer is responsible for not forgetting to allow the required fields
    // ! crappy as 'complex' lodash template won't work. Find another way to parse lodash templates
    try {
      return getHandlebarsVars(
        this.template.replace('<%=', '{{').replace('%>', '}}')
      )
    } catch {
      return []
    }
  }

  toObject() {
    // TODO get rid of Label.toObject: the implementer is responsible for not forgetting to allow the required fields
    const result: ObjectMap = {}
    for (const requirement of this.requirements) set(result, requirement, true)
    return result
  }
}
