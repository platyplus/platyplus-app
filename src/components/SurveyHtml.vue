<template lang="pug">
div(:class="question.cssClasses.root" v-html="question.locHtml.renderedHtml")
</template>
<script>
import { Html } from 'survey-vue'
export default {
  extends: Html,
  name: 'SurveyHtml'
}
</script>
