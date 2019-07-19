<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="entity_type" name="name" :readonly="reading"
        autofocus :enter="save")
      p-list-field(v-model="item.encounter_types" form="entity_type" name="encounter_types"
        :path="'/entity-type/'+item.id+'/encounter-type'"
        v-if="reading")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/entity-type/'+item.id"
        :key="item.id") {{ item.name }}
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
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
