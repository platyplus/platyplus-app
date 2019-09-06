import { Schema } from '../hasura'
import { RouteConfig } from 'vue-router'
import UserLayout from 'src/layouts/user/Layout.vue'
import UserHeader from 'src/layouts/user/Header.vue'
import UserMenu from 'src/layouts/user/Menu.vue'
import Index from 'src/components/hasura-table/Index.vue'
import CollectionLoader from 'src/components/hasura-table/CollectionLoader.vue'
import ReadElementDispatcher from 'src/components/hasura-table/ReadElementDispatcher.vue'
import EditElementDispatcher from 'src/components/hasura-table/EditElementDispatcher.vue'
import { ability } from '../user/store'

// ! This is a prototype function that should be implemented asap
export const createRoutes = (schema: Schema) => {
  return [
    {
      path: '/data/',
      component: UserLayout,
      children: schema.classes.map(tableClass => ({
        path: tableClass.name,
        components: {
          default: Index,
          header: UserHeader,
          menu: UserMenu
        },
        props: {
          default: { tableClass },
          header: { tableClass }
        },
        children: [
          {
            path: '',
            component: CollectionLoader,
            props: { tableClass },
            beforeEnter: (to, from, next) => {
              if (ability.can('select', tableClass.name)) next()
              else {
                // TODO not implemented
                return next('/unauthorized')
              }
            }
          },
          {
            path: 'read',
            component: ReadElementDispatcher,
            props: { tableClass },
            beforeEnter: (to, from, next) => {
              // TODO not ideal as this ability check is done before fetching the data
              if (ability.can('select', tableClass.name)) next()
              else {
                // TODO not implemented
                return next('/unauthorized')
              }
            }
          },
          {
            path: 'edit',
            component: EditElementDispatcher,
            props: { tableClass },
            beforeEnter: (to, from, next) => {
              // TODO not ideal as this ability check is done before fetching the data
              if (
                !tableClass.idColumnNames.every(
                  columnName => !!to.query[columnName]
                )
              ) {
                return next(`/data/${tableClass.name}`)
              }
              if (ability.can('update', tableClass.name)) next()
              else {
                return next('/error') // TODO not implemented
              }
            }
          },
          {
            path: 'create',
            component: EditElementDispatcher,
            props: { tableClass },
            beforeEnter: (to, from, next) => {
              if (ability.can('insert', tableClass.name)) next()
              else {
                return next('/error') // TODO not implemented
              }
            }
          }
        ]
      }))
    }
  ] as RouteConfig[]
}