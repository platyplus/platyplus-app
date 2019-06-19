<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-input(
        label="Name"
        :readonly="reading"
        v-model="form.name"
        ref="firstInput"
        @keyup.enter="save")
      q-toggle(
        label="Global"
        :disable="reading"
        v-model="form.global")
      q-field(
        v-if="reading"
        label="Role attributions"
        stack-label)
        template(v-slot:control)
          q-list(
            class="col-12"
            highlight)
            q-item(
              v-for="role in item.role_attributions"
              :to="'/role/'+item.id+'/attribution/'+role.id"
              :key="role.id") {{ role.user.username }} in {{ role.org_unit.name }}
            q-item(:to="'/role/'+item.id+'/attribution/create'")
              q-item-section(avatar)
                q-icon(name="fas fa-plus")
              q-item-section Create role attribution
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
import { mixin } from 'boot/form'

export default {
  name: 'PageRole',
  mixins: [mixin('role')]
}
</script>
