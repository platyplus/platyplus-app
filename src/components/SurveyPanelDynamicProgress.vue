<template lang="pug">
div
  input(type='range' v-if='question.isRangeShowing' min='0' :max='rangeMax' :value='question.currentIndex' style='width:25%;float:left;margin:5px' @change='changeRange')
  input(type='button' v-if='question.isPrevButtonShowing' :value='question.panelPrevText' style='float:left;margin:5px' :class="question.cssClasses.button  + ' ' + question.cssClasses.buttonPrev" @click='prevPanelClick')
  input(type='button' v-if='question.isNextButtonShowing' :value='question.panelNextText' style='float:left;margin:5px' :class="question.cssClasses.button  + ' ' + question.cssClasses.buttonNext" @click='nextPanelClick')
  input(type='button' v-if='question.canAddPanel' :value='question.panelAddText' style='float:left;margin:5px' :class="question.cssClasses.button  + ' ' + question.cssClasses.buttonAdd" @click='addPanelClick')
</template>
<script>
import { PanelDynamicProgress } from 'survey-vue'
export default {
  extends: PanelDynamicProgress,
  name: 'SurveyPanelDynamicProgress'
}
</script>
