<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(label="Name")
        q-input(
          :readonly="reading"
          v-model="form.name"
          ref="firstInput"
          @keyup.enter="save")
      q-field(
        label="Role attributions")
        q-list(
          v-if="item.role_attributions.length"
          highlight)
          q-item(
            v-for="role in item.role_attributions"
            :to="'/role/'+item.id+'/attribution/'+role.id"
            :key="role.id") {{ role.user.username }} in {{ role.org_unit.name }}
        q-btn(label="Create role attribution" :to="'/role/'+item.id+'/attribution/create'")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/role/'+item.id"
        :key="item.id") {{ item.name }}
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
