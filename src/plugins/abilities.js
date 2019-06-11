import { abilitiesPlugin } from '@casl/vue'
import { AbilityBuilder, Ability } from '@casl/ability'
import { getUser, loadUser } from 'plugins/auth'

export default async ({ app, router, store, Vue }) => {
  Vue.use(abilitiesPlugin)
  router.beforeEach(async (to, from, next) => {
    let user = getUser()
    if (!user) user = await loadUser() // TODO un peu moche mais seul moyen de récupérer l'utilisateur au chargement initial
    const abilities = defineAbilitiesFor(getUser())
    // TODO recuperer l'id, et l'envoyer aux abilities
    const canNavigate = to.matched.some(route => {
      return abilities.can(route.meta.action || 'read', route.meta.resource)
    })
    if (!user) {
      if (to.path === '/') return next('/public')
      if (!canNavigate) {
        store.dispatch('navigation/routeRequest', { path: to.path })
        return next('/public/auth/signin')
      }
    } else if (
      !user.preferred_org_unit &&
      !to.matched.some(route => route.meta.withoutPreferredOrgUnit)
    ) {
      store.dispatch('navigation/routeRequest', { path: to.path })
      next('/profile/current-org-unit')
    }
    if (!canNavigate) {
      // TODO uncomment
      console.log('Forbidden')
      //   return next('/')
    }
    return next()
  })
}

export function defineAbilitiesFor (user) {
  // TODO load only once when authenticated / first arrival on the site?
  // TODO completer
  const { rules, can } = AbilityBuilder.extract()
  can('read', 'public')
  if (user) {
    can('read', 'user')
    can('edit', 'user', { id: user.id }) // TODO recuperer l'id de l'auteur etc
    /*
  if (user.role === 'doctor') {
    can('manage', 'Patient', { treatedBy: user.id })
  }
  */
  }
  return new Ability(rules)
}
