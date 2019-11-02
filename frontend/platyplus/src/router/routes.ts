import { RouteConfig } from 'vue-router'
import { store } from '../store'
const hasuraTableUserComponents = () => ({
  header: () => import('layouts/user/Header.vue'),
  menu: () => import('layouts/user/Menu.vue')
})

const routes: RouteConfig[] = [
  // { path: '/', redirect: '/en/' }, // TODO: locale from the client's browser navigator.language.substring(0,2)
  {
    path: '/public',
    component: () => import('layouts/public/Layout.vue'),
    meta: {
      resource: 'public'
    },
    children: [
      {
        path: '',
        components: {
          default: () => import('pages/PublicIndex.vue'),
          header: () => import('components/HeaderBar.vue')
        }
      },
      {
        path: 'auth',
        component: () => import('layouts/public/Layout.vue'),
        children: [
          {
            path: 'signin',
            components: {
              default: () => import('pages/SignIn.vue'),
              header: () => import('components/HeaderBar.vue')
            }
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/user/Layout.vue'),
    children: [
      {
        path: '',
        components: {
          default: () => import('pages/Index.vue'),
          ...hasuraTableUserComponents()
        }
      },
      {
        // TODO decide whether to use the hasura system for the profile page, or to have a special profile page
        path: 'profile',
        components: {
          default: () => import('pages/Profile.vue'),
          ...hasuraTableUserComponents()
        },
        props: {
          default: () => ({
            id: store.getters['authentication/id'],
            tableClass: store.getters['hasura/class']('user')
          })
        }
      },
      {
        // TODO
        path: 'profile/edit',
        components: {
          default: () => import('pages/Profile.vue'),
          ...hasuraTableUserComponents()
        },
        props: () => ({
          editFlag: true,
          id: store.getters['authentication/id'],
          table: 'user'
        }),
        meta: {
          withoutPreferredOrgUnit: true
        }
      },
      {
        path: 'profile/current-org-unit',
        components: {
          default: () => import('pages/CurrentOrgUnit.vue'),
          ...hasuraTableUserComponents()
        },
        props: () => ({
          table: 'org_unit'
        }),
        meta: {
          withoutPreferredOrgUnit: true
        }
      },
      {
        path: 'import-export',
        components: {
          default: () => import('pages/ImportExport.vue'),
          ...hasuraTableUserComponents()
        }
      }
    ]
  }
]

// ! Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
