<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(label="Name")
        q-input(
          :readonly="reading"
          v-model="form.name"
          ref="firstInput"
          @keyup.enter="save")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/role/'+item.id"
        :key="item.id") {{ item.name }} ({{item.users_aggregate.aggregate.count}})
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageRole',
  mixins: [mixin('role')]
}
</script>
