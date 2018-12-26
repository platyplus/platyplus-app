<template lang="pug">
  q-page(padding class="justify-center")
    q-list(v-if="list.length && !details" highlight)
      q-item(v-for="item in list" :to="'/org-unit-type/'+item.id" :key="item.id") {{ item.name }}
    q-field(v-if="details" label="Name")
      q-input(:readonly="reading" v-model="form.name" ref="firstInput" @keyup.enter="save")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageOrgUnitType',
  mixins: [
    mixin({
      table: 'org_unit_type'
    })
  ]
}
</script>
