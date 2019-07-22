<template lang="pug">
q-field(:label="title"
  stack-label outlined
  :readonly="question.isReadOnly"
  :error="question.hasErrors()" bottom-slots)
  template(v-slot:control)
    div(class="self-center full-width row")
      div(v-if='!question.hasColumns' class="col")
        q-option-group(v-model="question.renderedValue"
          :options="options(question.visibleChoices)"
          type="checkbox"
          :inline="inline")
      div(v-if='question.hasColumns' v-for='column in question.columns' class="col")
        q-option-group(v-model="question.renderedValue" type="checkbox"
          :options="options(column)")
  template(v-slot:error)
    div(v-for="error in question.getAllErrors()") {{error.locText.renderedHtml}}
</template>
<script>
import { Checkbox } from 'survey-vue'
import { QOptionGroup } from 'quasar'

export default {
  extends: Checkbox,
  name: 'SurveyCheckbox',
  components: { QOptionGroup },
  props: {
    inline: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    options (collection) {
      return collection.map(item => ({
        value: item.value,
        label: item.locText.renderedHtml
      }))
    },
    isOtherActive (column) {
      if (
        this.question.hasOther &&
        this.question.renderedValue &&
        this.question.isOtherSelected
      ) {
        if (column) {
          return column.some(
            item => item.itemValue === this.question.otherItem.itemValue
          )
        } else return true
      }
      return false
    }
  },
  computed: {
    title () {
      // TODO put in a mixin
      return (
        (this.question.no ? String(this.question.no) + '. ' : '') +
        this.question.locTitle.renderedHtml
      )
    }
  }
}
</script>
