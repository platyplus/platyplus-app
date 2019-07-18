<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="entity_type" name="name" :readonly="reading"
        ref="firstInput"
        :enter="save")
      q-field(
        v-if="reading"
        label="Encounter types"
        stack-label)
        template(v-slot:control)
          q-list(
            class="col-12"
            highlight)
            q-item(
              v-for="encounterType in item.encounter_types"
              :to="'/entity-type/'+item.id+'/encounter-type/'+encounterType.id"
              :key="encounterType.id") {{ encounterType.name }}
            q-item(:to="'/entity-type/'+item.id+'/encounter-type/create'")
              q-item-section(avatar)
                q-icon(name="fas fa-plus")
              q-item-section New encounter type
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/entity-type/'+item.id"
        :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'

export default {
  name: 'PageEntityType',
  mixins: [mixin('entity_type')]
}
</script>
