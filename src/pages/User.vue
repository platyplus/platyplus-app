<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(
        )
      q-input(
        icon="fas fa-user"
        label="User name"
        :readonly="reading"
        v-model="form.username"
        ref="firstInput"
        @keyup.enter="save")
      q-select(
        icon="fas fa-user-lock"
        label="Global roles"
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.roles"
        :options="options('roles')")
      q-select(
        icon="fas fa-sitemap"
        :label="$t('user.labels.org_unit_memberships')"
        :helper="$t('user.helpers.org_unit_memberships')"
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.org_unit_memberships"
        :options="options('org_unit_memberships')")
      q-field(
        v-if="reading"
        icon="fas fa-user-lock"
        label="Role attributions")
        q-list(
          v-if="item.role_attributions.length"
          highlight)
          q-item(
            v-for="role in item.role_attributions"
            :to="'/user/'+item.id+'/attribution/'+role.id"
            :key="role.id") {{ role.role.name }} in {{ role.org_unit.name }}
        q-btn(label="Create role attribution" :to="'/user/'+item.id+'/attribution/create'")
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
import { mixin } from 'boot/form'

export default {
  name: 'PageUser',
  mixins: [mixin('user')]
}
</script>
