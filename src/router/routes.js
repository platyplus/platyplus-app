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
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'profile',
        component: () => import('pages/Profile.vue'),
        props: {
          id: store().getters['authentication/user'].id
        }
      },
      {
        path: 'profile/edit',
        component: () => import('pages/Profile.vue'),
        props: {
          editFlag: true,
          id: store().getters['authentication/user'].id
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
    ],
    beforeEnter: (to, from, next) => {
      if (store().state.authentication.status.loggedIn) next()
      else {
        if (to.path === '/') {
          next('/public')
        } else {
          store().dispatch('authentication/authRoute', { path: to.path })
          next('/auth/signin')
        }
      }
    }
  },
  {
    path: '/auth',
    component: () => import('layouts/AnonymousLayout.vue'),
    children: [{ path: 'signin', component: () => import('pages/SignIn.vue') }]
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
