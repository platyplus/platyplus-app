import * as orgUnitType from './orgUnitType'
import * as orgUnitTypeMapping from './orgUnitTypeMapping'

export const settings = {
  org_unit_type: orgUnitType.settings,
  org_unit_type_mapping: orgUnitTypeMapping.settings
}

export const fragments = {
  org_unit_type: orgUnitType.fragments,
  org_unit_type_mapping: orgUnitTypeMapping.fragments
}
export const mutations = {
  org_unit_type: orgUnitType.mutations,
  org_unit_type_mapping: orgUnitTypeMapping.mutations
}
export const queries = {
  org_unit_type: orgUnitType.queries,
  org_unit_type_mapping: orgUnitTypeMapping.queries
}
