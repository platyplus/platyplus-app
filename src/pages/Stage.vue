<template lang="pug">
  q-page(v-if="details" padding class="justify-center")
    router-link(v-if="item.workflow" :to="'/workflow/'+workflow_id") Back to {{item.workflow.name}}
    q-field(label="Name")
      q-input(:readonly="reading" v-model="form.name" ref="firstInput" @keyup.enter="save")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

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
