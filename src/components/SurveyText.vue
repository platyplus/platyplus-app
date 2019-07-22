<template lang="pug">

q-input(
  :type="question.inputType"
  class="self-center full-width"
  :label="title"
  stack-label
  outlined
  autogrow
  autofocus
  :readonly="question.isReadOnly"
  v-model="question.value"
  :id="question.inputId"
  :maxlength="question.getMaxLength()"
  :rows="question.rows"
  :placeholder="question.placeHolder"

  :size="question.size")
</template>
<script>
import { Text } from 'survey-vue'
export default {
  extends: Text,
  name: 'SurveyText',
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
