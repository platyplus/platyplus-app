<template lang="pug">
q-field(:label="title" stack-label outlined :readonly="question.isReadOnly")
  template(v-slot:control)
    div(class="self-center full-width")
      div(class="row")
        div(v-if='!question.hasColumns' class="col")
          q-option-group(v-model="question.renderedValue"
            :options="options(question.visibleChoices)")
          //- p-survey-other-choice(v-if="isOtherActive()" :question="question")
        div(v-if='question.hasColumns' v-for='column in question.columns' class="col")
          q-option-group(v-model="question.renderedValue"
            :options="options(column)")
      p-survey-other-choice(v-if="isOtherActive()" :question="question")
  //- div(v-if='question.canShowClearButton')
    //-   input(type='button' :class='question.cssClasses.clearButton' v-on:click='function() { question.clearValue(); }' :value='question.clearButtonCaption')
</template>

<script>
import { Radiogroup } from 'survey-vue'
import { QOptionGroup } from 'quasar'
export default {
  extends: Radiogroup,
  components: { QOptionGroup },
  name: 'SurveyRadiogroup',
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
