<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      router-link(:to="'/workflow/'+workflow_id") Back to {{item.workflow.name}}
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
  data () {
    return {}
  },
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
