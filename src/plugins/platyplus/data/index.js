import * as encounter from './encounter'
import * as encounterState from './encounterState'
import * as entity from './entity'

export const settings = {
  encounter: encounter.settings,
  encounter_state: encounterState.settings,
  entity: entity.settings
}

export const fragments = {
  encounter: encounter.fragments,
  encounter_state: encounterState.fragments,
  entity: entity.fragments
}

export const queries = {
  encounter: encounter.queries,
  encounter_state: encounterState.queries,
  entity: entity.queries
}

export const mutations = {
  encounter: encounter.mutations,
  encounter_state: encounterState.mutations,
  entity: entity.mutations
}
