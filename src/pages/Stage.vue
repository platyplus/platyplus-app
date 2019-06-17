<template lang="pug">
  q-page(v-if="details" padding class="justify-center")
    router-link(v-if="item.workflow" :to="'/workflow/'+workflow_id") Back to {{item.workflow.name}}
    q-field(label="Name")
      q-input(:readonly="reading" v-model="form.name" ref="firstInput" @keyup.enter="save")
    q-field(
      v-if="details"
      label="Possible previous stages"
      helper="Pick stages")
      q-select(
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.previous"
        :options="options('previous')")
    q-field(
      v-if="details"
      label="Possible next stages"
      helper="Pick stages")
      q-select(
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.next"
        :options="options('next')")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'
// TODO: next/previous: bug when removing reference to self
export default {
  name: 'PageOrgUnit',
  mixins: [mixin('stage')],
  props: ['workflow_id'],
  methods: {
    cancel () {
      this.$router.replace(
        this.$route.path.replace(
          this.createFlag ? '/stage/create' : '/edit',
          ''
        )
      )
    },
    reset () {
      this._resetItem()
      if (this.workflow_id) this.item.workflow_id = this.workflow_id
      this._resetForm()
    }
  }
}
</script>
