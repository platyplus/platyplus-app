<template lang="pug">
  q-page(padding class="justify-center")
    q-list(
      v-if="reading && !details && list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/entity-type/'+item.id"
        :key="item.id") {{ item.name }}
    q-field(
      v-if="details"
      label="Name")
      q-input(
        :readonly="reading"
        v-model="form.name"
        ref="firstInput"
        @keyup.enter="save")
    q-list(
      v-if="reading && details && item.encounter_types.length"
      highlight)
      q-item(
        v-for="encounterType in item.encounter_types"
        :to="'/entity-type/'+item.id+'/encounter-type/'+encounterType.id"
        :key="encounterType.id") {{ encounterType.name }}
    q-btn(v-if="reading && details" label="New encounter type" :to="'/entity-type/'+item.id+'/encounter-type/create'")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageEntityType',
  mixins: [mixin('entity_type')]
}
</script>
