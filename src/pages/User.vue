<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.username" form="user" name="username" :readonly="reading"
        ref="firstInput"
        :enter="save")
      p-select(v-model="relations.roles" form="user" name="roles" :readonly="reading"
        multiple :options="options('roles')")
      p-select(v-model="relations.org_unit_memberships" form="user" name="membership" :readonly="reading"
        multiple :options="options('org_unit_memberships')")
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
              :to="'/user/'+item.id+'/attribution/'+role.id"
              :key="role.id") {{ role.role.name }} in {{ role.org_unit.name }}
            q-item(:to="'/user/'+item.id+'/attribution/create'")
              q-item-section(avatar)
                q-icon(name="fas fa-plus")
              q-item-section Create role attribution
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/user/'+item.id"
        :key="item.id") {{ item.username }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'

export default {
  name: 'PageUser',
  mixins: [mixin('user')]
}
</script>
