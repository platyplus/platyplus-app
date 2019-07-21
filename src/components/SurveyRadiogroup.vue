<template lang="pug">
  div(class="self-center full-width")
    div(class="row")
      q-option-group(v-if='!question.hasColumns' v-model="question.renderedValue" :options="options(question.visibleChoices)")
      div(v-if='question.hasColumns' v-for='column in question.columns' class="col")
        q-option-group(v-model="question.renderedValue" :options="options(column)")
    div(class="row" v-show="question.hasOther && question.renderedValue && question.isOtherSelected")
      survey-other-choice(:question="question")
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
    }
  }
}
</script>
