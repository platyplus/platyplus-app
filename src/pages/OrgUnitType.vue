<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-input(
        label="Name"
        :readonly="reading"
        v-model="form.name"
        ref="firstInput"
        @keyup.enter="save")
      q-select(
        label="Possible direct parents"
        helper="Pick org unit types"
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.from"
        :options="options('from')")
      q-select(
        label="Possible direct children"
        helper="Pick org unit types"
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.to"
        :options="options('to')")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/org-unit-type/'+item.id"
        :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'

export default {
  name: 'PageOrgUnitType',
  mixins: [mixin('org_unit_type')]
}
</script>
