<template lang="pug">
td
  div(v-if='cell.hasQuestion')
    component(v-if='isVisible' :is="'p-'+getWidgetComponentName(cell.question)" :question='cell.question' :inline="false")
  button(v-if='cell.isRemoveRow' type='button' :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove" @click='removeRowClick()')
    span {{question.removeRowText}}
    span(:class='question.cssClasses.iconRemove')
  div(v-if='cell.hasTitle') {{cell.locTitle.renderedHtml}}
</template>
<script>
import { MatrixCell } from 'survey-vue'
export default {
  extends: MatrixCell,
  name: 'SurveyMatrixCell'
}
</script>
