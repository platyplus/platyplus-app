<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="org_unit_type" name="name" :readonly="reading"
        autofocus :enter="save")
      p-select(v-model="relations.from" form="org_unit_type" name="from" :readonly="reading"
        multiple :options="options('from')")
      p-select(v-model="relations.to" form="org_unit_type" name="to" :readonly="reading"
        multiple :options="options('to')")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/org-unit-type/'+item.id"
        :key="item.id") {{ item.name }}
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
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
