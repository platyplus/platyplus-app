<template lang="pug">
  q-input(type="textarea"
    class="self-center full-width"
    :label="title"
    stack-label
    autogrow
    :readonly="question.isReadOnly"
    v-model="question.value"
    :id="question.inputId"
    :maxlength="question.getMaxLength()"
    :rows="question.rows"
    :placeholder="question.placeHolder")
</template>
<script>
import { Comment } from 'survey-vue'
export default {
  extends: Comment,
  name: 'SurveyComment',
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
