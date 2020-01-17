<template lang="pug">
  q-drawer(v-if="authenticated" v-model="drawer" side="left" bordered)
    q-list(no-border link inset-delimiter)
      q-item-label(header) Main
      h-menu-item(to="/" icon="home") {{translate('index.title')}}
      h-menu-item(to="/profile" icon="user-circle") {{translate('user.profile.title')}}

      template(v-if="profile.preferred_org_unit")
        q-item-label(header) {{ profile.preferred_org_unit.name }}
        h-menu-item(:to="'/org-unit/'+profile.preferred_org_unit.id+'/workflow/' + node.workflow.id" icon="route"
          v-for="node in profile.preferred_org_unit.workflows" :key="node.id") {{node.workflow.name}}
        h-menu-item(:to="'/org-unit/'+profile.preferred_org_unit.id+'/encounter-type/' + node.encounter_type.id" icon="route"
          v-for="node in profile.preferred_org_unit.isolated_encounter_types" :key="node.id") {{node.encounter_type.name}}
      q-separator

      q-item-label(header) Configuration
      h-menu-item(v-if="canSelect('org_unit')" to="/data/org_unit" icon="sitemap") Organisation
      h-menu-item(v-if="canSelect('role')" to="/data/role" icon="user-lock") Roles
      h-menu-item(v-if="canSelect('workflow')" to="/data/workflow" icon="route") Workflows
      h-menu-item(v-if="canSelect('encounter_type')" to="/data/encounter_type" icon="comments") Encounter Types
      q-separator

      q-item-label(header) Metadata
      h-menu-item(v-if="canSelect('org_unit_type')" to="/data/org_unit_type" icon="sitemap") Org Unit Types
      h-menu-item(v-if="canSelect('entity_type')" to="/data/entity_type" icon="heartbeat") Entity Types
      q-separator
      
      q-item-label(header) Administration
      h-menu-item(to="/import-export" icon="sync") Import/Export
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { useDrawer } from '../../composables/navigation'
import { useTranslator } from '../../modules/i18n'
import { useCanSelect } from '../../modules/metadata'
import { useProfile, useAuthenticated } from '../../modules/authentication'

export default createComponent({
  props: {
    icon: String,
    to: String
  },
  setup() {
    const drawer = useDrawer()
    const translate = useTranslator()
    const profile = useProfile()
    const authenticated = useAuthenticated()
    const canSelect = useCanSelect()
    return { drawer, translate, profile, authenticated, canSelect }
  }
})
</script>

<style></style>
