import { RouteConfig } from 'vue-router'

import CollectionLoader from '../components/collections/collection-loader.vue'
import ReadElementDispatcher from '../components/elements/read/read-element-dispatcher.vue'
import EditElementDispatcher from '../components/elements/edit/edit-element-dispatcher.vue'
import PageLayout from 'layouts/Page.vue'
import UserLayout from 'layouts/user/Layout.vue'
import UserHeader from 'layouts/user/Header.vue'
import UserMenu from 'layouts/user/Menu.vue'
import { tablesMetadata } from '../modules/metadata'

// TODO where to put this function? How to decouple the UI components from the metadata logic?
export const createRoutes = () => {
  return [
    {
      path: '/data/',
      component: UserLayout,
      children: tablesMetadata().map(table => ({
        path: table.name || '',
        components: {
          default: PageLayout,
          header: UserHeader,
          menu: UserMenu
        },
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
}
