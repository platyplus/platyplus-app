<template lang="pug">
  div
    div(ref="jsoneditor")
</template>

<script>
import JSONEditor from '@json-editor/json-editor'
export default {
  name: 'JsonEditor',
  data () {
    return {
      editor: null,
      internalChange: false
    }
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    value: [Object, Array, Number, String, Boolean],
    schema: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onChange () {
      let error = false
      let json = {}
      try {
        json = this.editor.getValue()
        error = false
      } catch (err) {
        error = true
      }
      if (error) {
        this.$emit('error')
      } else {
        if (this.editor) {
          this.internalChange = true
          this.$emit('input', json)
          this.$nextTick(() => {
            this.internalChange = false
          })
        }
      }
    },
    initView () {
      if (!this.editor) {
        var container = this.$refs.jsoneditor
        const options = Object.assign(
          {
            schema: this.schema,
            format: 'grid',
            onChange: this.onChange,
            disable_collapse: true,
            disable_edit_json: true,
            disable_properties: true,
            no_additional_properties: true,
            template: 'handlebars',
            theme: 'materialize', // TODO: custom Quasar theme
            iconlib: 'fontawesome5'
          },
          this.options
        )
        this.editor = new JSONEditor(container, options)
      }
      const defaultValue = Object.assign(
        this.value || {},
        this.editor.getValue()
      )
      this.editor.setValue(defaultValue)
    },
    destroyView () {
      if (this.editor) {
        this.editor.destroy()
        this.editor = null
      }
    }
  },
  watch: {
    value (value) {
      if (this.editor && value && !this.internalChange) {
        this.editor.setValue(value)
      }
    }
  },
  mounted () {
    this.initView()
  },
  beforeDestroy () {
    this.destroyView()
  }
}
</script>

<style>
</style>
