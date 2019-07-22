<template lang="pug">
q-input(type="textarea"
  class="self-center full-width"
  :label="title"
  stack-label outlined
  autogrow
  autofocus
  :readonly="question.isReadOnly"
  v-model="question.value"
  :id="question.inputId"
  :maxlength="question.getMaxLength()"
  :rows="question.rows"
  :placeholder="question.placeHolder"
  :error="question.hasErrors()" bottom-slots)
  template(v-slot:error)
    div(v-for="error in question.getAllErrors()") {{error.locText.renderedHtml}}
</template>

<script>
import { Comment } from 'survey-vue'
export default {
  extends: Comment,
  name: 'SurveyComment',
  props: {
    inline: {
      // Flags 'false' when in a table -> mixin
      type: Boolean,
      default: true
    }
  },
  computed: {
    title () {
      // TODO put in a mixin
      if (!this.inline) return
      return (
        (this.question.no ? String(this.question.no) + '. ' : '') +
        this.question.locTitle.renderedHtml
      )
    }
  }
}
</script>
