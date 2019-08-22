import { Vue, Component, Prop } from 'vue-property-decorator'
import { get } from 'object-path'

/*eslint-disable @typescript-eslint/camelcase */
/*eslint-disable @typescript-eslint/no-explicit-any */
const icons: Record<string, any> = {
  preferred_org_unit: 'location-arrow',
  created_at: 'clock',
  username: 'user',
  first_name: 'user-edit',
  last_name: 'user-edit',
  role_attributions: 'user-tag',
  name: 'tag',
  password: 'key',
  roles: 'user-lock',
  membership: 'sitemap',
  workflow: 'route',
  workflows: 'route',
  type: 'angle-double-up',
  language: 'language',
  encounter_type: {
    create: 'tag',
    isolated_uses: 'sitemap',
    entity_type: 'heartbeat',
    encounter_schema: 'file-code'
  },
  user: {
    self: 'user'
  },
  role: {
    self: 'user-lock'
  },
  org_unit: {
    self: 'sitemap',
    parent: 'sitemap',
    children: 'sitemap'
  },
  org_unit_type: {
    from: 'sitemap',
    to: 'sitemap'
  }
}
/*eslint-enable @typescript-eslint/camelcase */

export const types: { [key: string]: string } = {
  password: 'password'
}
// TODO refaire un systeme plus malin, idealement calé sur le schema serveur
// Définir une icône par table et la déduire des relations. De cette manière,
// on déduit que user.memberships est de type org_unit[] et donc avec l'icône sitemap
export const icon = (form: string, name: string) => {
  if (icons[name]) {
    if (typeof icons[name] === 'string') return icons[name]
    else return get(icons, `${name}.self`)
  } else if (icons[form]) {
    return get(icons, `${form}.${name}`)
  } else return undefined
}

@Component
export class FieldMixin extends Vue {
  @Prop(Function) public readonly enter?: Function
  @Prop(String) public readonly form?: string
  @Prop(String) public readonly name?: string
  @Prop({ type: Boolean, default: false })
  public readonly readonly: boolean = false
  @Prop([Object, String]) public readonly value?: {} | string

  public get localValue() {
    return this.value
  }

  public set localValue(newValue) {
    this.$emit('input', newValue)
  }

  public get icon() {
    return this.form && this.name && icon(this.form, this.name)
  }
}
