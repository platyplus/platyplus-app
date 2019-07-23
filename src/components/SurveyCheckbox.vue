<template lang="pug">
q-field(:label="title"
  stack-label outlined
  :readonly="question.isReadOnly"
  :error="question.currentErrorCount > 0" @blur="question.hasErrors()" bottom-slots no-error-icon)
  template(v-slot:control)
    div(class="self-center full-width row")
      div(v-if='!question.hasColumns' class="col")
        q-option-group(v-model="question.renderedValue"
          :options="options(question.visibleChoices)"
          @input="question.hasErrors()"
          type="checkbox"
          :inline="inline")
      div(v-if='question.hasColumns' v-for='column in question.columns' class="col")
        q-option-group(v-model="question.renderedValue" type="checkbox"
          @input="question.hasErrors()"
          :options="options(column)")
    p-survey-other-choice(v-if="question.hasOther && question.isOtherSelected" :question="question")
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
