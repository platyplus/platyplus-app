<template lang="pug">
q-input(v-if="!question.isReadOnly"
      borderless
      autofocus
      v-model="question.comment"
      :maxlength="question.getOthersMaxLength()"
      :placeholder="question.otherPlaceHolder"
      :label="question.locTitle.renderedHtml")
div(v-else :class="question.cssClasses.other") {{question.comment}}
</template>
<script>
export default {
  // TODO focus when the 'other' choice is selected (emit/on $root?)
  name: 'SurveyOtherChoice',
  props: ['question']
}
</script>
