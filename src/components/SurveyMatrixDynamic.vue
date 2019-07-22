<template lang="pug">
q-card
  q-card-section
    div(class="text-subtitle1 text-weight-medium") {{question.locTitle.renderedHtml}}
  q-card-section(v-if='question.isAddRowOnTop')
    button(type='button' :class="question.cssClasses.button + ' ' + question.cssClasses.buttonAdd" @click='addRowClick')
      span {{question.addRowText}}
      span(:class='question.cssClasses.iconAdd')
  q-card-section
    p-survey-matrixtable(:question='question')
  q-card-section(v-if='question.isAddRowOnBottom')
    //- div(:class='question.cssClasses.footer')
    button(type='button' :class="question.cssClasses.button + ' ' + question.cssClasses.buttonAdd" @click='addRowClick')
      span {{question.addRowText}}
      span(:class='question.cssClasses.iconAdd')
</template>
<script>
import { MatrixDynamic } from 'survey-vue'
export default {
  extends: MatrixDynamic,
  name: 'SurveyMatrixDynamic'
}
</script>
