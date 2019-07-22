<template lang="pug">
q-card(flat bordered)
  q-card-section
    div(class="text-subtitle1 text-weight-medium") {{question.locTitle.renderedHtml}}
  q-card-section
    p-survey-matrixtable(:question="question")
</template>
<script>
import { MatrixDropdown } from 'survey-vue'
export default {
  extends: MatrixDropdown,
  name: 'SurveyMatrixdropdown'
}
</script>
