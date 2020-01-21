import { RouteConfig } from 'vue-router'

import CollectionLoader from './components/collections/collection-loader.vue'
import ReadElementDispatcher from './components/elements/read/read-element-dispatcher.vue'
import EditElementDispatcher from './components/elements/edit/edit-element-dispatcher.vue'
import { tablesMetadata } from '../metadata'

type ComponentOptions = Pick<RouteConfig, 'component' | 'components'>
export type LayoutOptions = {
  mainLayout?: ComponentOptions
  pageLayout?: ComponentOptions
}
export const createRoutes = ({ mainLayout, pageLayout }: LayoutOptions = {}) =>
  [
    {
      path: '/data/',
      component: mainLayout?.component,
      components: mainLayout?.components,
      children: tablesMetadata().map(table => ({
        path: table.name || '',
        component: pageLayout?.component,
        components: pageLayout?.components,
        props: {
          default: { table: table.name },
          header: { table: table.name }
        },
        children: [
          {
            path: '',
            component: CollectionLoader,
            props: { table: table.name },
            beforeEnter: (to, from, next) => {
              if (table.canSelect) next()
              // TODO not implemented
              else return next('/unauthorized')
            }
          },
          {
            path: 'read',
            component: ReadElementDispatcher,
            props: { table: table.name },
            beforeEnter: (to, from, next) => {
              // TODO not ideal as this ability check is done before fetching the data
              if (table.canSelect) next()
              // TODO not implemented
              else return next('/unauthorized')
            }
          },
          {
            path: 'edit',
            component: EditElementDispatcher,
            props: { table: table.name },
            beforeEnter: (to, from, next) => {
              // TODO not ideal as this ability check is done before fetching the data
              if (!table.idFields?.every(field => !!to.query[field.name]))
                return next(`/data/${table.name}`)
              if (table.canUpdate) next()
              // TODO not implemented
              else return next('/error')
            }
          },
          {
            path: 'create',
            component: EditElementDispatcher,
            props: { table: table.name },
            beforeEnter: (to, from, next) => {
              if (table.canInsert) next()
              else return next('/error') // TODO not implemented
            }
          }
        ]
      }))
    }
  ] as RouteConfig[]