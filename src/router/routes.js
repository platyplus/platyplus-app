import { getUser } from '../plugins/auth'
import { snakeCase } from 'lodash'
const crudRoutes = (path, page, id = 'id') => {
  const resource = snakeCase(page)
  return [
    {
      path,
      component: () => import(`pages/${page}.vue`),
      props: route => ({
        ...route.params
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
        createFlag: true
      }),
      meta: {
        resource,
        action: 'create'
      }
    },
    {
      path: `${path}/:${id}`,
      component: () => import(`pages/${page}.vue`),
      props: true,
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
        editFlag: true
      }),
      meta: {
        resource,
        action: 'edit'
      }
    }
  ]
}
const routes = [
  // { path: '/', redirect: '/en/' }, // TODO: locale from the client's browser
  {
    path: '/public',
    component: () => import('layouts/DefaultLayout.vue'),
    meta: {
      resource: 'public'
    },
    children: [
      {
        path: '',
        component: () => import('pages/PublicIndex.vue')
      },
      {
        path: 'auth',
        component: () => import('layouts/DefaultLayout.vue'),
        children: [
          {
            path: 'signin',
            component: () => import('pages/SignIn.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'profile',
        component: () => import('pages/Profile.vue'),
        props: route => ({
          id: getUser().id
        })
      },
      {
        path: 'profile/edit',
        component: () => import('pages/Profile.vue'),
        props: route => ({
          editFlag: true,
          id: getUser().id
        }),
        meta: {
          withoutPreferredOrgUnit: true
        }
      },
      {
        path: 'profile/current-org-unit',
        component: () => import('pages/CurrentOrgUnit.vue'),
        meta: {
          withoutPreferredOrgUnit: true
        }
      },
      {
        path: 'import-export',
        component: () => import('pages/ImportExport.vue')
      },
      ...crudRoutes('org-unit', 'OrgUnit'),
      {
        path: 'org-unit/:id/create',
        component: () => import('pages/OrgUnit.vue'),
        props: route => ({
          createFlag: true,
          parent_id: route.params.id
        })
      },
      ...crudRoutes('org-unit/:org_unit_id/attribution', 'RoleAttribution'),
      ...crudRoutes('org-unit/:org_unit_id/workflow', 'Workflow'),
      ...crudRoutes(
        'org-unit/:org_unit_id/stage/:stage_id/encounter-type/:type_id',
        'EncounterState'
      ),
      ...crudRoutes('org-unit-type', 'OrgUnitType'),
      ...crudRoutes('entity-type', 'EntityType'),
      ...crudRoutes(
        'entity-type/:entity_type_id/encounter-type',
        'EncounterType'
      ),
      ...crudRoutes('encounter-type', 'EncounterType'),
      ...crudRoutes('workflow', 'Workflow'),
      ...crudRoutes('workflow/:workflow_id/stage', 'Stage'),
      ...crudRoutes('user', 'User'),
      ...crudRoutes('user/:user_id/attribution', 'RoleAttribution'),
      ...crudRoutes('role', 'Role'),
      ...crudRoutes('role/:role_id/attribution', 'RoleAttribution'),
      ...crudRoutes(
        'org-unit/:org_unit_id/encounter-type/:type_id',
        'Encounter'
      ),
      ...crudRoutes('encounter', 'Encounter')
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
