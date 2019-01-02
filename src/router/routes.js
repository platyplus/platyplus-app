import store from '../store'
function crudRoutes (path, page) {
  return [
    { path, component: () => import(`pages/${page}.vue`) },
    {
      path: `${path}/create`,
      component: () => import(`pages/${page}.vue`),
      props: { createFlag: true }
    },
    {
      path: `${path}/:id`,
      component: () => import(`pages/${page}.vue`),
      props: true
    },
    {
      path: `${path}/:id/edit`,
      component: () => import(`pages/${page}.vue`),
      props: route => ({
        id: route.params.id,
        editFlag: true
      })
    }
  ]
}
const routes = [
  {
    path: '/public',
    component: () => import('layouts/AnonymousLayout.vue'),
    children: [{ path: '', component: () => import('pages/PublicIndex.vue') }]
  },
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          withoutPreferredOrgUnit: true
        }
      },
      {
        path: 'profile',
        component: () => import('pages/Profile.vue'),
        props: {
          id: store().getters['authentication/user'].id
        },
        meta: {
          withoutPreferredOrgUnit: true
        }
      },
      {
        path: 'profile/edit',
        component: () => import('pages/Profile.vue'),
        props: {
          editFlag: true,
          id: store().getters['authentication/user'].id
        },
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
      ...crudRoutes('org-unit', 'OrgUnit'),
      {
        path: 'org-unit/:id/create',
        component: () => import('pages/OrgUnit.vue'),
        props: route => ({
          createFlag: true,
          parent_id: route.params.id
        })
      },
      ...crudRoutes('org-unit-type', 'OrgUnitType')
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AnonymousLayout.vue'),
    children: [
      {
        path: 'signin',
        component: () => import('pages/SignIn.vue'),
        meta: {
          public: true
        }
      }
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
