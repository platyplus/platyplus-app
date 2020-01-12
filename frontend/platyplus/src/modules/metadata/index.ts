import _Vue from 'vue'
import { Store } from 'vuex'

import { ObjectMap } from '../../types/common'

import { metadataModule } from './module'
import { tableMetadata } from './getters'
import { Table } from './types/objects'

export { tableNamesList, tableMetadata, tablesMetadata } from './getters'
export { elementAsOption, optionAsElement } from './helpers'

export interface MetadataOptions {
  store: Store<{}>
  //   app: _Vue
}

export function MetadataPlugin(Vue: typeof _Vue, options: MetadataOptions) {
  const { store } = options
  store.registerModule('metadata', metadataModule)

  Vue.mixin({
    methods: {
      $metadata(table: string) {
        return tableMetadata(table)
      },
      $can(
        action: 'select' | 'insert' | 'update' | 'delete',
        context: string | ObjectMap
      ) {
        let tableName: string
        if (typeof context === 'string') {
          tableName = context
        } else {
          // TODO context is a data element: get the table name from __typename?
          // TODO define a 'data element' type as an ObjectMap with __typename
          tableName = context.__typename as string
        }
        if (!tableName) return false
        const metadata = tableMetadata(tableName)
        switch (action) {
          case 'select':
            return metadata.canSelect
          case 'insert':
            return metadata.canInsert
          case 'update':
            return metadata.canUpdate
          case 'delete':
            return metadata.canDelete
          default:
            return false
        }
      }
    }
  })
}

declare module 'vue/types/vue' {
  interface Vue {
    $metadata(table: string, schema?: string): Table
    $can(
      action: 'select' | 'insert' | 'update' | 'delete',
      context: string | ObjectMap,
      schema?: string
    ): boolean
  }
}
