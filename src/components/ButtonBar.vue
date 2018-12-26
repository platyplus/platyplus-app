<template lang="pug">
  div
    q-btn(v-if="isCreate && !details" label="Create" @click="create")
    q-btn(v-if="isEdit && reading && details" label="Edit" @click="edit")
    q-btn(v-if="isSave && !reading" label="Save" @click="save")
    q-btn(v-if="isReset && !reading" label="Reset" @click="reset")
    q-btn(v-if="isCancel && !reading" label="Cancel" @click="cancel")
    q-btn(v-if="isRemove && reading && details" label="Delete" @click="remove")
</template>

<script>
export default {
  name: 'ButtonBar',
  props: ['details', 'reading'],
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
    }
  }
}
</script>

<style>
</style>
