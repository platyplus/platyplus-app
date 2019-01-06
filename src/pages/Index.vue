<template lang="pug">
  q-page(
    v-if="authenticated"
    padding
    class="justify-center")
    div(v-if="user.preferred_org_unit" v-t="{path: 'location.message', args: {location: user.preferred_org_unit.name}}")
    q-list(
      v-if="user.org_unit_memberships.length > 1"
      highlight)
      q-item(to="/profile/current-org-unit" :exact="true")
        q-item-side(icon="fas fa-location-arrow")
        q-item-main(v-t="'location.change'")

</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
