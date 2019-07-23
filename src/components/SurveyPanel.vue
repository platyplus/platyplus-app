<template lang="pug">
q-card(v-if='question.isVisible' flat bordered class="q-mx-none")
  q-card-section(@click='changeExpanded' class="q-py-sm")
    div(class="text-subtitle1 text-weight-medium") {{title}}
      span(v-show='showIcon') TODO icon {{iconCss}}
    div(class="text-subtitle2 text-weight-medium") {{question.locDescription.renderedHtml}}
    //- survey-errors(:question='question')
  q-card-section(v-if='!isCollapsed' class="q-py-none")
    div(v-for='(row, index) in rows' :key="question.id + '_' + index" v-if='row.visible')
      p-survey-row(:row='row' :survey='survey')
</template>
<script>
import { Panel } from 'survey-vue'
export default {
  extends: Panel,
  name: 'SurveyPanel',
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
