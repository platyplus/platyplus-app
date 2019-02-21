import * as orgUnit from './orgUnit'
import * as orgUnitWorkflow from './orgUnitWorkflow'
import * as user from './user'
import * as userOrgUnit from './userOrgUnit'
import * as roleAttribution from './roleAttribution'
import * as role from './role'
import * as userRole from './userRole'
import * as workflow from './workflow'
import * as stage from './stage'
import * as stageTransition from './stageTransition'
import * as encounterType from './encounterType'
import * as encounterTypeStage from './encounterTypeStage'

export const settings = {
  org_unit: orgUnit.settings,
  org_unit_workflow: orgUnitWorkflow.settings,
  user: user.settings,
  user_org_unit: userOrgUnit.settings,
  role_attribution: roleAttribution.settings,
  role: role.settings,
  user_role: userRole.settings,
  workflow: workflow.settings,
  stage: stage.settings,
  stage_transition: stageTransition.settings,
  encounter_type: encounterType.settings,
  encounter_type_stage: encounterTypeStage.settings
}

export const fragments = {
  org_unit: orgUnit.fragments,
  org_unit_workflow: orgUnitWorkflow.fragments,
  user: user.fragments,
  user_org_unit: userOrgUnit.fragments,
  role_attribution: roleAttribution.fragments,
  role: role.fragments,
  user_role: userRole.fragments,
  workflow: workflow.fragments,
  stage: stage.fragments,
  stage_transition: stageTransition.fragments,
  encounter_type: encounterType.fragments,
  encounter_type_stage: encounterTypeStage.fragments
}

export const queries = {
  org_unit: orgUnit.queries,
  org_unit_workflow: orgUnitWorkflow.queries,
  user: user.queries,
  user_org_unit: userOrgUnit.queries,
  role_attribution: roleAttribution.queries,
  role: role.queries,
  user_role: userRole.queries,
  workflow: workflow.queries,
  stage: stage.queries,
  stage_transition: stageTransition.queries,
  encounter_type: encounterType.queries,
  encounter_type_stage: encounterTypeStage.queries
}

export const mutations = {
  org_unit: orgUnit.mutations,
  org_unit_workflow: orgUnitWorkflow.mutations,
  user: user.mutations,
  user_org_unit: userOrgUnit.mutations,
  role_attribution: roleAttribution.mutations,
  role: role.mutations,
  user_role: userRole.mutations,
  workflow: workflow.mutations,
  stage: stage.mutations,
  stage_transition: stageTransition.mutations,
  encounter_type: encounterType.mutations,
  encounter_type_stage: encounterTypeStage.mutations
}
