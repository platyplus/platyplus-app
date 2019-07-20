<template lang="pug">
  div
    p-survey-element(v-if="element.visible" v-for="element in row.elements"
      :key="element.idValue" :id="element.id"
      :element="element" :survey="survey"
      :style="{ paddingLeft: element.paddingLeft, paddingRight: element.paddingRight, width: element.renderWidth, display: 'inline-block' }")
</template>
<script>
import { Row } from 'survey-vue'
export default {
  extends: Row,
  name: 'SurveyRow'
}
</script>
