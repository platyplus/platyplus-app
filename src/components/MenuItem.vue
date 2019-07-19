<template lang="pug">
  q-item(clickable :to="to" :exact="true")
    q-item-section(avatar)
      q-icon(:name="'fas fa-'+icon")
    q-item-section
      slot
</template>

<script>
export default {
  name: 'MenuItem',
  props: ['icon', 'to']
}
</script>

<style>
</style>
