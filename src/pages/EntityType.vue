<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(
        label="Name")
        q-input(
          :readonly="reading"
          v-model="form.name"
          ref="firstInput"
          @keyup.enter="save")
      q-field(
        v-if="reading"
        label="Encounter types")
        q-list(
          v-if="item.encounter_types.length"
          highlight)
          q-item(
            v-for="encounterType in item.encounter_types"
            :to="'/entity-type/'+item.id+'/encounter-type/'+encounterType.id"
            :key="encounterType.id") {{ encounterType.name }}
        q-btn(label="New encounter type" :to="'/entity-type/'+item.id+'/encounter-type/create'")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/entity-type/'+item.id"
        :key="item.id") {{ item.name }}
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
