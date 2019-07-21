<template lang="pug">
q-field(:label="title" stack-label :readonly="question.isReadOnly" outlined)
  template(v-slot:control)
    div(v-for="(row, rowindex) in question.getRows()"
      :key="question.inputId + 'rowkey' + rowindex"
      class="row self-center full-width q-field--borderless")
      //- survey-errors(v-if="hasErrorsOnTop" :question="item.editor" :location="'top'")
      component(v-for="item in row" :is="'p-'+getWidgetComponentName(item.editor)" :question="item.editor")
      //- survey-errors(v-if="hasErrorsOnBottom" :question="item.editor" :location="'bottom'")
</template>
<script>
import { MultipleText } from 'survey-vue'
export default {
  extends: MultipleText,
  name: 'SurveyMultipletext',
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
