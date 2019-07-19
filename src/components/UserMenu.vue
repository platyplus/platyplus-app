<template lang="pug">
  q-drawer(v-model="drawer" side="left" bordered)
    q-list(no-border link inset-delimiter)
      q-item-label(header) Main
      p-menu-item(to="/" icon="home") Home
      p-menu-item(to="/profile" icon="user-circle") {{$t('user.profile.title')}}

      template( v-if="user.preferred_org_unit")
        q-item-label(header) {{ user.preferred_org_unit.name }}
        p-menu-item(:to="'/org-unit/'+user.preferred_org_unit.id+'/workflow/' + node.workflow.id" icon="route"
          v-for="node in user.preferred_org_unit.workflows" :key="node.id") {{node.workflow.name}}
        p-menu-item(:to="'/org-unit/'+user.preferred_org_unit.id+'/encounter-type/' + node.encounter_type.id" icon="route"
          v-for="node in user.preferred_org_unit.isolated_encounter_types" :key="node.id") {{node.encounter_type.name}}
      q-separator

      q-item-label(header) Configuration
      p-menu-item(to="/org-unit" icon="sitemap") Organisation
      p-menu-item(to="/role" icon="user-lock") Roles
      p-menu-item(to="/workflow" icon="route") Workflows
      p-menu-item(to="/encounter-type" icon="comments") Encounter Types
      q-separator

      q-item-label(header) Metadata
      p-menu-item(to="/org-unit-type" icon="sitemap") Org Unit Types
      p-menu-item(to="/entity-type" icon="heartbeat") Entity Types
      q-separator
      q-item-label(header) Administration
      p-menu-item(to="/import-export" icon="sync") Import/Export
</template>

<script>
export default {
  name: 'UserMenu',
  computed: {
    drawer: {
      get () {
        return this.$store.getters['navigation/drawer']
      },
      set (value) {
        this.$store.dispatch('navigation/setDrawer', { value })
      }
    }
  },
  created () {
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
