import * as orgUnit from './orgUnit'
import * as user from './user'
import * as userOrgUnit from './userOrgUnit'
import * as role from './role'
import * as workflow from './workflow'
import * as stage from './stage'
import * as stageTransition from './stageTransition'
import * as encounterType from './encounterType'

export const settings = {
  org_unit: orgUnit.settings,
  user: user.settings,
  user_org_unit: userOrgUnit.settings,
  role: role.settings,
  workflow: workflow.settings,
  stage: stage.settings,
  stage_transition: stageTransition.settings,
  encounter_type: encounterType.settings
}

export const fragments = {
  org_unit: orgUnit.fragments,
  user: user.fragments,
  user_org_unit: userOrgUnit.fragments,
  role: role.fragments,
  workflow: workflow.fragments,
  stage: stage.fragments,
  stage_transition: stageTransition.fragments,
  encounter_type: encounterType.fragments
}

export const queries = {
  org_unit: orgUnit.queries,
  user: user.queries,
  user_org_unit: userOrgUnit.queries,
  role: role.queries,
  workflow: workflow.queries,
  stage: stage.queries,
  stage_transition: stageTransition.queries,
  encounter_type: encounterType.queries
}

export const mutations = {
  org_unit: orgUnit.mutations,
  user: user.mutations,
  user_org_unit: userOrgUnit.mutations,
  role: role.mutations,
  workflow: workflow.mutations,
  stage: stage.mutations,
  stage_transition: stageTransition.mutations,
  encounter_type: encounterType.mutations
}
