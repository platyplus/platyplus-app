import { RouteConfig } from 'vue-router'
// import { snakeCase } from 'lodash'
/*
const crudRoutes = (path: string, page: string, id = 'id'): RouteConfig[] => {
  const resource = snakeCase(page)
  return [
    {
      path,
      component: () => import(`pages/${page}.vue`),
      props: route => ({
        ...route.params,
        table: resource
      }),
      meta: {
        resource
      }
    },
    {
      path: `${path}/create`,
      component: () => import(`pages/${page}.vue`),
      props: route => ({
        ...route.params,
        createFlag: true,
        table: resource
      }),
      meta: {
        resource,
        action: 'create'
      }
    },
    {
      path: `${path}/:${id}`,
      component: () => import(`pages/${page}.vue`),
      props: route => ({
        ...route.params,
        table: resource
      }),
      meta: {
        resource,
        action: 'read'
      }
    },
    {
      path: `${path}/:${id}/edit`,
      component: () => import(`pages/${page}.vue`),
      props: route => ({
        ...route.params,
        editFlag: true,
        table: resource
      }),
      meta: {
        resource,
        action: 'edit'
      }
    }
  ]
}
*/
const hasuraTableUserComponents = () => ({
  header: () => import('layouts/user/Header.vue'),
  menu: () => import('layouts/user/Menu.vue')
})
const routes: RouteConfig[] = [
  // { path: '/', redirect: '/en/' }, // TODO: locale from the client's browser
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
          header: () => import('layouts/public/Header.vue')
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
              header: () => import('layouts/public/Header.vue')
            },
            props: {
              header: {
                title: 'Signin'
              }
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
        path: 'profile',
        components: {
          default: () => import('pages/Profile.vue'),
          ...hasuraTableUserComponents()
        },
        props: () => ({
          // id: getUser().id, // TODO TS
          table: 'user'
        })
      },
      {
        path: 'profile/edit',
        components: {
          default: () => import('pages/Profile.vue'),
          ...hasuraTableUserComponents()
        },
        props: () => ({
          editFlag: true,
          // id: getUser().id, // TODO TS
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
      // ...crudRoutes('org-unit', 'OrgUnit'),
      // {
      //   path: 'org-unit/:id/create',
      //   component: () => import('pages/OrgUnit.vue'),
      //   props: route => ({
      //     createFlag: true,
      //     parent_id: route.params.id
      //   })
      // },
      // ...crudRoutes('org-unit/:org_unit_id/attribution', 'RoleAttribution'),
      // ...crudRoutes('org-unit/:org_unit_id/workflow', 'Workflow'),
      // ...crudRoutes(
      //   'org-unit/:org_unit_id/stage/:stage_id/encounter-type/:type_id',
      //   'EncounterState'
      // ),
      // ...crudRoutes('org-unit-type', 'OrgUnitType'),
      // ...crudRoutes('entity-type', 'EntityType'),
      // ...crudRoutes(
      //   'entity-type/:entity_type_id/encounter-type',
      //   'EncounterType'
      // ),
      // ...crudRoutes('encounter-type', 'EncounterType'),
      // ...crudRoutes('workflow', 'Workflow'),
      // ...crudRoutes('workflow/:workflow_id/stage', 'Stage'),
      // ...crudRoutes('user', 'User'),
      // ...crudRoutes('user/:user_id/attribution', 'RoleAttribution'),
      // ...crudRoutes('role', 'Role'),
      // ...crudRoutes('role/:role_id/attribution', 'RoleAttribution'),
      // ...crudRoutes(
      //   'org-unit/:org_unit_id/encounter-type/:type_id',
      //   'Encounter'
      // ),
      // ...crudRoutes('encounter', 'Encounter')
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
