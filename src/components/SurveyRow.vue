<template lang="pug">
div(class="row")
  p-survey-element(v-if="element.visible" v-for="element in row.elements"
    :key="element.idValue" :id="element.id"
    :element="element" :survey="survey"
    class="col-sm col-xs-12 q-mr-xs q-mb-sm")
</template>
<script>
import { Row } from 'survey-vue'
export default {
  extends: Row,
  name: 'SurveyRow'
}
</script>
