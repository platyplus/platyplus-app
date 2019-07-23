<template lang="pug">
q-field(:label="title"
  stack-label outlined
  class="row"
  :readonly="question.isReadOnly"
  :error="question.currentErrorCount > 0" @blur="question.hasErrors()" bottom-slots no-error-icon
  :clearable="question.canShowClearButton")
  template(v-slot:control)
    div(class="self-center full-width")
      div(v-if='!question.hasColumns' class="col")
        q-option-group(v-model="question.renderedValue"
          @input="question.hasErrors()"
          :options="options(question.visibleChoices)"
          :inline="inline")
      div(v-if='question.hasColumns' v-for='column in question.columns' class="col")
        q-option-group(v-model="question.renderedValue"
          @input="question.hasErrors()"
          :options="options(column)")
    p-survey-other-choice(v-if="isOtherActive()" :question="question")
  //- div(v-if='question.canShowClearButton')
    //-   input(type='button' :class='question.cssClasses.clearButton' v-on:click='function() { question.clearValue(); }' :value='question.clearButtonCaption')
  template(v-slot:error)
    div(v-for="error in question.getAllErrors()") {{error.locText.renderedHtml}}
</template>

<script>
import { Radiogroup } from 'survey-vue'
import { QOptionGroup } from 'quasar'
export default {
  extends: Radiogroup,
  components: { QOptionGroup },
  name: 'SurveyRadiogroup',
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
    isOtherActive () {
      return (
        this.question.hasOther &&
        this.question.renderedValue &&
        this.question.isOtherSelected
      )
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
