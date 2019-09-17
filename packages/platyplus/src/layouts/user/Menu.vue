<template lang="pug">
  q-drawer(v-if="$authenticated" v-model="drawer" side="left" bordered)
    q-list(no-border link inset-delimiter)
      q-item-label(header) Main
      p-menu-item(to="/" icon="home") Home
      p-menu-item(to="/profile" icon="user-circle") {{$t('user.profile.title')}}

      template(v-if="$profile.preferred_org_unit")
        q-item-label(header) {{ $profile.preferred_org_unit.name }}
        p-menu-item(:to="'/org-unit/'+$profile.preferred_org_unit.id+'/workflow/' + node.workflow.id" icon="route"
          v-for="node in $profile.preferred_org_unit.workflows" :key="node.id") {{node.workflow.name}}
        p-menu-item(:to="'/org-unit/'+$profile.preferred_org_unit.id+'/encounter-type/' + node.encounter_type.id" icon="route"
          v-for="node in $profile.preferred_org_unit.isolated_encounter_types" :key="node.id") {{node.encounter_type.name}}
      q-separator

      q-item-label(header) Configuration
      p-menu-item(v-if="$can('select', 'org_unit')" to="/data/org_unit" icon="sitemap") Organisation
      p-menu-item(v-if="$can('select', 'role')" to="/data/role" icon="user-lock") Roles
      p-menu-item(v-if="$can('select', 'workflow')" to="/data/workflow" icon="route") Workflows
      p-menu-item(v-if="$can('select', 'encounter_type')" to="/data/encounter_type" icon="comments") Encounter Types
      q-separator

      q-item-label(header) Metadata
      p-menu-item(v-if="$can('select', 'org_unit_type')" to="/data/org_unit_type" icon="sitemap") Org Unit Types
      p-menu-item(v-if="$can('select', 'entity_type')" to="/data/entity_type" icon="heartbeat") Entity Types
      q-separator
      
      q-item-label(header) Administration
      p-menu-item(to="/import-export" icon="sync") Import/Export
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
@Component
export default class UserMenu extends Vue {
  @Prop(String) readonly icon?: string
  @Prop(Boolean) readonly to?: string

  get drawer() {
    return this.$store.getters['navigation/drawer']
  }

  set drawer(value) {
    this.$store.dispatch('navigation/setDrawer', { value })
  }

  created() {
    if (this.$store.getters['navigation/drawer'] === null) {
      this.$store.dispatch('navigation/setDrawer', {
        value: this.$q.platform.is.desktop
      })
    }
  }
}
</script>

<style>
</style>
