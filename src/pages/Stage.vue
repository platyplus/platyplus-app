<template lang="pug">
  q-page(v-if="details" padding class="justify-center")
    router-link(v-if="item.workflow" :to="'/workflow/'+workflow_id") Back to {{item.workflow.name}}
    p-input(v-model="form.name" form="stage" name="name" :readonly="reading"
      autofocus :enter="save")
    p-select(v-model="relations.previous" form="stage" name="previous" :readonly="reading"
      multiple :options="options('previous')")
    p-select(v-model="relations.next" form="stage" name="next" :readonly="reading"
      multiple :options="options('next')")
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'
// TODO: next/previous: bug when removing reference to self
export default {
  name: 'PageStage',
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
