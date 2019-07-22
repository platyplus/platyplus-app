<template lang="pug">
q-input(
  :type="inputType"
  class="self-center full-width"
  :label="title"
  stack-label outlined
  :mask="question.inputType === 'date' ? 'date': ''"
  :autogrow="question.inputType === 'textarea'"
  :readonly="question.isReadOnly"
  v-model="question.value"
  :id="question.inputId"
  :maxlength="question.getMaxLength()"
  :rows="question.rows"
  :placeholder="question.placeHolder"
  :size="question.size"
  :error="question.currentErrorCount > 0" @blur="question.hasErrors()" bottom-slots)
  template(v-slot:error)
    div(v-for="error in question.getAllErrors()") {{error.locText.renderedHtml}}
  template(v-slot:append v-if="question.inputType === 'date'")
    q-icon(name="fas fa-calendar" class="cursor-pointer")
      q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
        q-date(v-model="question.value" @input="() => $refs.qDateProxy.hide()")
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
    },
    inputType () {
      if (this.question.inputType === 'date') return undefined
      else return this.question.inputType
    }
  }
}
</script>
