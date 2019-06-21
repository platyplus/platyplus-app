<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-select(
        label="User"
        stack-label
        emit-value
        map-options
        :readonly="reading || Boolean(user_id)"
        clearable
        filter
        v-model="form.user_id"
        :options="options('user')")
      q-select(
        label="Role"
        stack-label
        emit-value
        map-options
        :readonly="reading || Boolean(role_id)"
        clearable
        filter
        v-model="form.role_id"
        :options="options('role')")
      q-select(
        label="Org Unit"
        stack-label
        emit-value
        map-options
        :readonly="reading || Boolean(org_unit_id)"
        clearable
        filter
        v-model="form.org_unit_id"
        :options="options('org_unit')")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/role-attribution/'+item.id"
        :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @save="save" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
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
