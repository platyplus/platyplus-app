<template lang="pug">
div(v-show="table.rows.length")
  q-markup-table
    thead(v-if='table.showHeader')
      tr
        th(v-for='cell in table.headerRow.cells' :key="'header_' + cell.id") {{cell.locTitle.renderedHtml}}
    tbody
      tr(v-for='(row, rowIndex) in table.rows' :key="question.inputId + '_' + rowIndex")
        p-survey-matrixcell(:cell='cell' :question='question' v-for='(cell, cellIndex) in row.cells' :key="rowIndex + '_' + cellIndex")
    tfoot(v-if='table.showFooter')
      tr
        p-survey-matrixcell(:cell='cell' :question='question' v-for='(cell, cellIndex) in table.footerRow.cells' :key="'footer_' + cellIndex")
</template>
<script>
import { MatrixTable } from 'survey-vue'
import { QMarkupTable, QTh, QTr, QTd } from 'quasar'
export default {
  extends: MatrixTable,
  name: 'SurveyMatrixTable',
  components: { QMarkupTable, QTh, QTr, QTd }
}
</script>
<style>
</style>
