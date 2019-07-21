<template lang="pug">
q-field(:label="title" stack-label outlined :readonly="question.isReadOnly")
  template(v-slot:control)
    q-rating(v-model="question.value"
      :max="question.rateMax"
      size="1.5em"
      class="self-center full-width q-pa-sm")
  //- <div>
  //-   <div :class="question.cssClasses.root">
  //-     <label
  //-       v-for="(item, index) in question.visibleRateValues"
  //-       :key="item.value"
  //-       :class="getCss(question, item)"
  //-     >
  //-       <input
  //-         type="radio"
  //-         style="display: none;"
  //-         :name="question.name"
  //-         :id="question.name + index"
  //-         :value="item.value"
  //-         :disabled="question.isReadOnly"
  //-         @change="change"
  //-         v-bind:aria-required="question.isRequired"
  //-         :aria-label="item.locText.text"
  //-       />
  //-       <span v-if="index === 0" :class="question.cssClasses.minText">
  //-         <survey-string :locString="question.locMinRateDescription" />
  //-       </span>
  //-       <span :class="question.cssClasses.itemText">
  //-         <survey-string :locString="item.locText" />
  //-       </span>
  //-       <span
  //-         v-if="index === question.visibleRateValues.length-1"
  //-         :class="question.cssClasses.maxText"
  //-       >
  //-         <survey-string :locString="question.locMaxRateDescription" />
  //-       </span>
  //-     </label>
  //-   </div>
  //-   <survey-other-choice
  //-     v-show="question.hasOther"
  //-     :class="question.cssClasses.other"
  //-     :question="question"
  //-   />
  //- </div>
</template>

<script>
import { Rating } from 'survey-vue'
import { QRating } from 'quasar'
export default {
  extends: Rating,
  name: 'SurveyRating',
  components: { QRating },
  computed: {
    title () {
      // TODO put in a mixin
      return (
        (this.question.no ? String(this.question.no) + '. ' : '') +
        this.question.locTitle.renderedHtml
      )
    }
  },
  created () {
    // TODO incorrect: doit pouvoir enregistrer la valeur 'undefined'
    if (!this.question.value) {
      this.question.value = this.question.defaultValue || 0
    }
  }
}
</script>
