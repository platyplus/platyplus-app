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
      p-list-field(v-model="item.role_attributions" form="user" name="role_attributions"
        :path="'/user/'+item.id+'/attribution'"
        :item-label-template="'{{ user.username }} in {{ org_unit.name }}'"
        v-if="reading")
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
