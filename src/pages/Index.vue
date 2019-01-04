<template lang="pug">
  q-page(
    v-if="user"
    padding
    class="justify-center")
    div(v-if="user.preferred_org_unit") You are in: {{user.preferred_org_unit.name}}
    q-list(
      v-if="user.org_unit_memberships.length > 1"
      highlight)
      q-item(to="/profile/current-org-unit" :exact="true")
        q-item-side(icon="fas fa-location-arrow")
        q-item-main(label="Change place")

</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
