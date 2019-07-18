<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="role" name="name" :readonly="reading"
        ref="firstInput"
        :enter="save")
      q-toggle(
        label="Global"
        :disable="reading"
        v-model="form.global")
      p-list-field(v-model="item.role_attributions" form="role" name="role_attributions"
        :path="'/role/'+item.id+'/attribution'"
        :item-label-template="'{{ user.username }} in {{ org_unit.name }}'"
        v-if="reading")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/role/'+item.id"
        :key="item.id") {{ item.name }}
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
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
