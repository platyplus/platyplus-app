import { Schema } from '../hasura'
import { RouteConfig } from 'vue-router'
import UserLayout from 'src/layouts/user/Layout.vue'
import UserHeader from 'src/layouts/user/Header.vue'
import UserMenu from 'src/layouts/user/Menu.vue'
import Index from 'src/components/hasura-table/Index.vue'
import ListLoader from 'src/components/hasura-table/ListLoader.vue'
import ReadElementDispatcher from 'src/components/hasura-table/ReadElementDispatcher.vue'
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
            component: ListLoader,
            props: { tableClass },
            beforeEnter: (to, from, next) => {
              console.log('Implement the list navigation guard') // TODO
              console.log(to.params)
              next()
            }
          },
          {
            path: ':id',
            component: ReadElementDispatcher,
            props: route => ({
              ...route.params,
              tableClass
            }),
            beforeEnter: (to, from, next) => {
              console.log('Implement the read navigation guard') // TODO
              console.log(from)
              console.log(
                ability.can('read', {
                  ...to.params,
                  __typename: tableClass.name
                })
              )
              next()
            }
          }
        ]
      }))
    }
  ] as RouteConfig[]
  // return this.classes.map(tableClass => ({
  //   name: tableClass.name,
  //   allowedRoutes: {
  //     list: true,
  //     create: true,
  //     view: true,
  //     edit: true
  //   }
  // }))
}
