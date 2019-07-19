<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-select(v-model="form.user_id" form="role_attribution" name="user" :readonly="reading || Boolean(user_id)"
        required
        :options="options('user')" option-label="username")
      p-select(v-model="form.role_id" form="role_attribution" name="role" :readonly="reading || Boolean(user_id)"
        required
        :options="options('role')")
      p-select(v-model="form.org_unit_id" form="role_attribution" name="org_unit" :readonly="reading || Boolean(user_id)"
        required
        :options="options('org_unit')")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/role-attribution/'+item.id"
        :key="item.id") {{ item.name }}
    p-button-bar(:reading="reading" :details="details" @create="create" @save="save" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'
export default {
  name: 'PageRoleAttribution',
  mixins: [mixin('role_attribution')],
  props: ['role_id', 'user_id', 'org_unit_id'],
  methods: {
    cancel () {
      this.$router.replace(
        this.$route.path.replace(
          this.createFlag ? '/attribution/create' : '/edit',
          ''
        )
      )
    },
    reset () {
      this._resetItem()
      if (this.role_id) this.item.role_id = this.role_id
      if (this.user_id) this.item.user_id = this.user_id
      if (this.org_unit_id) this.item.org_unit_id = this.org_unit_id
      this._resetForm()
    }
  }
}
</script>
