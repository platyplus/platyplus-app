<template lang="pug">
q-field(
  v-if='question.isVisible'
  :label="question.locTitle.renderedHtml"
  stack-label outlined
  :readonly="question.isReadOnly"
  :error="question.currentErrorCount > 0" @blur="question.hasErrors()" bottom-slots)
  template(v-slot:control)
    q-markup-table(class="self-center full-width")
      thead(v-if='question.showHeader')
        tr
          th(v-show='question.hasRows')
          th(v-for='column in question.visibleColumns')
            survey-string(:loc-string='column.locText')
      tbody
        tr(v-for='(row, rowIndex) in question.visibleRows' :class='question.cssClasses.row')
          td(v-show='question.hasRows')
            survey-string(:loc-string='row.locText')
          td(v-if='question.hasCellText' v-for='(column, columnIndex) in question.visibleColumns' v-on:click='function() { cellClick(row, column); }')
            span {{question.getCellDisplayLocText(row.name, column).renderedHtml}}
          td(v-if='!question.hasCellText' v-for='(column, columnIndex) in question.visibleColumns' :headers='column.locText.renderedHtml')
            q-radio(v-model="row.value" :val="column.value" :disable='question.isReadOnly' :id="question.inputId + '_' + row.name + '_' + columnIndex" @click="question.hasErrors()")
  template(v-slot:error)
    div(v-for="error in question.getAllErrors()") {{error.locText.renderedHtml}}
</template>
<script>
import { Matrix } from 'survey-vue'
import { QMarkupTable, QRadio } from 'quasar'

export default {
  extends: Matrix,
  name: 'SurveyMatrix',
  components: { QMarkupTable, QRadio }
}
</script>
