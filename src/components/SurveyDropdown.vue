<template lang="pug">
div
  //- workaround to show 'number dropdown' as number input. Replace with a q-select number?
  q-input(v-if="question.choicesMax > 0"
      type="number"
      v-model.number='numberValue'
      :min="question.choicesMin"
      :max="question.choicesMax"
      :step="question.choicesStep"
      :label="title || question.optionsCaption"
      :error="question.currentErrorCount > 0" @blur="question.hasErrors()" bottom-slots
      stack-label
      outlined
      :readonly="question.isReadOnly"
      :id="question.inputId")
  q-select(v-model="question.renderedValue"
      :label="title || question.optionsCaption"
      stack-label
      outlined
      emit-value
      :error="question.currentErrorCount > 0" @blur="question.hasErrors()" bottom-slots
      :readonly="question.isReadOnly"
      :id="question.inputId"
      :options="question.visibleChoices"  option-label="text" option-value="itemValue" :option-disable="(item) => !item.isEnabled")
  p-survey-other-choice(v-show='isOtherSelected' :question='question')
</template>

<script>
import { Dropdown } from 'survey-vue'
import { QSelect } from 'quasar'
export default {
  extends: Dropdown,
  name: 'SurveyDropdown',
  components: { QSelect },
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
    numberValue: {
      get () {
        return this.value ? this.value.value : undefined
      },
      set (value) {
        this.value = { value }
      }
    }
  }
}
</script>
