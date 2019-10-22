// TODO yurky definition
export interface User {
  id?: string
  locale: string
  preferred_org_unit_id?: string
  preferred_org_unit?: {}
  org_unit_memberships?: { org_unit: { id: string } }[]
}
