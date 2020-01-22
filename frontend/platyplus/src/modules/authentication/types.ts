// TODO generate the types in the same way as for the metadata service
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
