<template lang="pug">
  div
    q-page-sticky(position="bottom-right" :offset="[18, 18]")
      q-btn(v-if="isCreate && !details" @click="create" fab icon="fas fa-plus" color="primary" )
    q-btn(v-if="isEdit && reading && details" v-t="'edit'" @click="edit")
    q-btn(v-if="isSave && !reading" :disable="isSaveDisabled" v-t="'ok'" @click="save")
    q-btn(v-if="isReset && !reading" v-t="'reset'" @click="reset")
    q-btn(v-if="isCancel && !reading" v-t="'cancel'" @click="cancel")
    q-btn(v-if="isRemove && reading && details" v-t="'remove'" @click="remove")
</template>

<script>
export default {
  name: 'ButtonBar',
  props: ['details', 'reading', 'disableSave'],
  methods: {
    create () {
      this.$emit('create')
    },
    edit () {
      this.$emit('edit')
    },
    save () {
      this.$emit('save')
    },
    reset () {
      this.$emit('reset')
    },
    cancel () {
      this.$emit('cancel')
    },
    remove () {
      this.$emit('remove')
    }
  },
  computed: {
    isCreate () {
      return this._events.create !== undefined
    },
    isEdit () {
      return this._events.edit !== undefined
    },
    isSave () {
      return this._events.save !== undefined
    },
    isReset () {
      return this._events.reset !== undefined
    },
    isCancel () {
      return this._events.cancel !== undefined
    },
    isRemove () {
      return this._events.remove !== undefined
    },
    isSaveDisabled () {
      return Boolean(this.disableSave)
    }
  }
}
</script>

<style>
</style>
