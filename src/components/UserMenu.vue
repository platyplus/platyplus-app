<template lang="pug">
  q-layout-drawer(v-model="drawer" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null")
    q-list(no-border link inset-delimiter)
      q-list-header Main
      q-item(to="/" :exact="true")
        q-item-side(icon="fas fa-home")
        q-item-main(label="Home")
      q-item(to="/profile")
        q-item-side(icon="fas fa-user-circle")
        q-item-main(label="Profile")
      q-list-header {{ user.preferred_org_unit && user.preferred_org_unit.name }}
      q-item(v-for="node in user.preferred_org_unit.workflows" :to="'/org-unit/'+user.preferred_org_unit.id+'/workflow/' + node.workflow.id")
        q-item-side(icon="fas fa-route")
        q-item-main {{node.workflow.name}}
      q-list-header Configuration
      q-item(to="/org-unit")
        q-item-side(icon="fas fa-sitemap")
        q-item-main(label="Organisation")
      q-item(to="/role")
        q-item-side(icon="fas fa-user-lock")
        q-item-main(label="Roles")
      q-item(to="/user")
        q-item-side(icon="fas fa-users")
        q-item-main(label="Users")
      q-item(to="/workflow")
        q-item-side(icon="fas fa-route")
        q-item-main(label="Workflows")
      q-item(to="/encounter-type")
        q-item-side(icon="fas fa-comments")
        q-item-main(label="Encounter Types")
      q-list-header Metadata
      q-item(to="/org-unit-type")
        q-item-side(icon="fas fa-sitemap")
        q-item-main(label="Org Unit Types")
      q-item(to="/entity-type")
        q-item-side(icon="fas fa-heartbeat")
        q-item-main(label="Entity Types")
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
