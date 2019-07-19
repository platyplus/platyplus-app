const icons = {
  preferred_org_unit: 'location-arrow',
  created_at: 'clock',
  username: 'user',
  password: 'key',
  roles: 'user-lock',
  membership: 'sitemap',
  workflow: 'route',
  language: 'language',
  org_unit: {
    parent: 'sitemap'
  }
}
export const types = {
  password: 'password'
}
// TODO refaire un systeme plus malin, idealement calé sur le schema serveur
// Définir une icône par table et la déduire des relations. De cette manière,
// on déduit que user.memberships est de type org_unit[] et donc avec l'icône sitemap
export const icon = (form, name) =>
  icons[name] || ((icons[form] && icons[form][name]) || undefined)

export const FieldMixin = {
  props: {
    enter: Function,
    form: String,
    name: String,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value
      },
      set (localValue) {
        this.$emit('input', localValue)
      }
    },
    icon () {
      return icon(this.form, this.name)
    }
  }
}
