<template lang="pug">
q-card(v-if='question.isVisible' flat bordered)
  q-card-section: div(class="text-subtitle1 text-weight-medium") {{title}}
  q-card-section
    div(v-for="(row, rowindex) in question.getRows()"
      :key="question.inputId + 'rowkey' + rowindex")
      //- survey-errors(v-if="hasErrorsOnTop" :question="item.editor" :location="'top'")
      component(v-for="(item, index) in row"
      :is="'p-'+getWidgetComponentName(item.editor)"
      :question="item.editor"
      :key="question.inputId + '-' + rowindex + '-' + index"
      class="q-pa-xs")
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
