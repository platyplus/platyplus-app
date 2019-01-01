<template lang="pug">
  q-page(padding class="justify-center")
    q-list(
      v-if="list.length && !details"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/org-unit-type/'+item.id"
        :key="item.id") {{ item.name }}
    q-field(
      v-if="details"
      label="Name")
      q-input(
        :readonly="reading"
        v-model="form.name"
        ref="firstInput"
        @keyup.enter="save")
    q-field(
      v-if="details"
      label="Possible direct parents"
      helper="Pick org unit types")
      q-select(
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.from"
        :options="options('from')")
    q-field(
      v-if="details"
      label="Possible direct children"
      helper="Pick org unit types")
      q-select(
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.to"
        :options="options('to')")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageOrgUnitType',
  mixins: [mixin('org_unit_type')]
}
</script>
