<template lang="pug">
  q-drawer(v-model="drawer" side="left" bordered)
    q-list(no-border link inset-delimiter)
      q-item-label(header) Main
      q-item(to="/" :exact="true")
        q-item-section(avatar)
          q-icon(name="fas fa-home")
        q-item-section Home
      q-item(to="/profile")
        q-item-section(avatar)
         q-icon(name="fas fa-user-circle")
        q-item-section Profile
      template(v-if="user.preferred_org_unit")
        q-separator(spaced)
        q-item-label(header) {{ user.preferred_org_unit && user.preferred_org_unit.name }}
        q-item(v-for="node in user.preferred_org_unit.workflows" :key="node.id" :to="'/org-unit/'+user.preferred_org_unit.id+'/workflow/' + node.workflow.id")
          q-item-section(avatar)
           q-icon(name="fas fa-route")
          q-item-section {{node.workflow.name}}
        q-item(v-for="node in user.preferred_org_unit.isolated_encounter_types" :key="node.id" :to="'/org-unit/'+user.preferred_org_unit.id+'/encounter-type/' + node.encounter_type.id")
          q-item-section(avatar)
           q-icon(name="fas fa-table")
          q-item-section {{node.encounter_type.name}}
      q-separator(spaced)
      q-item-label(header) Configuration
      q-item(to="/org-unit")
        q-item-section(avatar)
          q-icon(name="fas fa-sitemap")
        q-item-section Organisation
      q-item(to="/role")
        q-item-section(avatar)
          q-icon(name="fas fa-user-lock")
        q-item-section Roles
      q-item(to="/user")
        q-item-section(avatar)
          q-icon(name="fas fa-users")
        q-item-section Users
      q-item(to="/workflow")
        q-item-section(avatar)
          q-icon(name="fas fa-route")
        q-item-section Workflows
      q-item(to="/encounter-type")
        q-item-section(avatar)
          q-icon(name="fas fa-comments")
        q-item-section Encounter Types
      q-separator(spaced)
      q-item-label(header) Metadata
      q-item(to="/org-unit-type")
        q-item-section(avatar)
          q-icon(name="fas fa-sitemap")
        q-item-section Org Unit Types
      q-item(to="/entity-type")
        q-item-section(avatar)
          q-icon(name="fas fa-heartbeat")
        q-item-section Entity Types
      q-separator(spaced)
      q-item-label(header) Administration
      q-item(to="/import-export")
        q-item-section(avatar)
          q-icon(name="fas fas fa-sync")
        q-item-section Import/Export
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
