<template lang="pug">
  q-page(class="flex flex-center")
    q-btn(v-if="!authenticated" to="/auth/signin" icon="fas fa-sign-in-alt" label="Sign in")

</template>

<style>
</style>

<script>
export default {
  name: 'PagePublicIndex'
}
</script>
