<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(
        label="User name") {{ item.username }}
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/user/'+item.id"
        :key="item.id") {{ item.username }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageUser',
  mixins: [mixin('user')]
}
</script>
