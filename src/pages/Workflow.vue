<template lang="pug">
  q-page(padding class="justify-center")
    q-list(
      v-if="list.length && !details"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/workflow/'+item.id"
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
      v-if="details && item.stages.length"
      highlight)
      q-item(
        v-for="item in item.stages"
        :to="'/'+id+'/stage/'+item.id"
        :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageWorkflow',
  mixins: [mixin('workflow')]
}
</script>
