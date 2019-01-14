import * as orgUnitType from './orgUnitType'
import * as orgUnitTypeMapping from './orgUnitTypeMapping'
import * as entityType from './entityType'

export const settings = {
  org_unit_type: orgUnitType.settings,
  org_unit_type_mapping: orgUnitTypeMapping.settings,
  entity_type: entityType.settings
}

export const fragments = {
  org_unit_type: orgUnitType.fragments,
  org_unit_type_mapping: orgUnitTypeMapping.fragments,
  entity_type: entityType.fragments
}
export const mutations = {
  org_unit_type: orgUnitType.mutations,
  org_unit_type_mapping: orgUnitTypeMapping.mutations,
  entity_type: entityType.mutations
}
export const queries = {
  org_unit_type: orgUnitType.queries,
  org_unit_type_mapping: orgUnitTypeMapping.queries,
  entity_type: entityType.queries
}
