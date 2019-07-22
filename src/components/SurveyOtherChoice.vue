<template lang="pug">
q-input(v-if="!question.isReadOnly"
      borderless
      autofocus
      v-model="question.comment"
      :maxlength="question.getOthersMaxLength()"
      :placeholder="question.otherPlaceHolder"
      :label="question.otherText"
      :error="hasErrors" bottom-slots)
div(v-else) {{question.comment}}
</template>

<script>
export default {
  // TODO focus when the 'other' choice is selected (emit/on $root?)
  name: 'SurveyOtherChoice',
  props: ['question'],
  computed: {
    hasErrors () {
      return (
        this.question.currentErrorCount > 0 &&
        this.question
          .getAllErrors()
          .some(item => item.text === this.question.otherErrorText)
      )
    }
  }
}
</script>
