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
        label="Stages")
        q-list(
          v-if="item.stages.length"
          highlight)
          q-item(
            v-for="stage in item.stages"
            :to="'/workflow/'+item.id+'/stage/'+stage.id"
            :key="stage.id") {{ stage.name }}
        q-btn(label="Create stage" :to="'/workflow/'+item.id+'/stage/create'")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/workflow/'+item.id"
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
