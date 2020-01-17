// TODO yurky definition: generate like metadata?
interface OrgUnit {
  id: string
}

export interface User {
  id?: string
  locale: string
  preferred_org_unit_id?: string
  preferred_org_unit?: OrgUnit
  org_unit_memberships?: { org_unit: OrgUnit }[]
}
