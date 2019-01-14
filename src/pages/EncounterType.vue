<template lang="pug">
  q-page(padding class="justify-center")
    q-list(
      v-if="reading && !details && list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/encounter-type/'+item.id"
        :key="item.id") {{ item.name }}
    q-field(
      v-if="details"
      label="Name")
      q-input(
        :readonly="reading"
        v-model="form.name"
        ref="firstInput"
        @keyup.enter="save")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageEncounterType',
  mixins: [mixin('encounter_type')]
}
</script>
