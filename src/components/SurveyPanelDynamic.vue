<template lang="pug">
q-card(v-if='question.isVisible' flat bordered)
  q-card-section
    div(class="text-subtitle1 text-weight-medium") {{title}}
    div(class="text-subtitle2 text-weight-medium") {{question.locDescription.renderedHtml}}
  q-card-section
    p-survey-paneldynamicprogress(v-if='question.isProgressTopShowing' :question='question')
    div(v-for='panel in renderedPanels' :key='panel.id')
      p-survey-panel(:question='panel' :inline="false")
      q-btn(v-if='!question.isReadOnly && !panel.isCollapsed && question.canRemovePanel' @click='removePanelClick(panel)' :label="question.panelRemoveText")
    p-survey-paneldynamicprogress(v-if='question.isProgressBottomShowing' :question='question')
    q-btn(v-if='question.isRenderModeList && question.canAddPanel' :label='question.panelAddText' @click='addPanelClick')
</template>
<script>
import { PanelDynamic } from 'survey-vue'
export default {
  extends: PanelDynamic,
  name: 'SurveyPanelDynamic',
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
