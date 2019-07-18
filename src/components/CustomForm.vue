<template lang="pug">
  q-page(class="flex flex-center")
    div {{survey.title}}
    survey(:survey="survey", :css="css")
    q-btn(v-if="!survey.isFirstPage" @click="previous()") previous
    q-btn(v-if="!survey.isLastPage" @click="next()") next
    q-btn( @click="reset()") reset
    q-btn(v-if="survey.isLastPage" @click="submit()") submit
</template>

<style></style>

<script>
import * as Survey from 'survey-vue'
Survey.StylesManager.applyTheme('default')

// TODO https://github.com/surveyjs/survey-library/blob/master/src/defaultCss/cssstandard.ts
const css = {}

const defaultOptions = {
  showTitle: false,
  showNavigationButtons: 'none',
  showProgressBar: 'bottom',
  goNextPageAutomatic: true
}
export default {
  name: 'PCustomForm',
  props: {
    schema: {},
    value: {}
  },
  data () {
    let jsonSurvey = { ...defaultOptions, ...this.schema }
    // TODO make the initial schema dynamic (with a 'watch'?)
    let survey = new Survey.Model(jsonSurvey)
    survey.data = this.value
    survey.onComplete.add(this.onSave)
    survey.onValueChanged.add(this.onChange)
    return {
      survey,
      css,
      initialValues: this.value
    }
  },
  methods: {
    reset () {
      this.survey.clear()
      this.survey.data = this.initialValues
      this.$emit('input', this.initialValues)
    },
    next () {
      this.survey.nextPage()
    },
    previous () {
      this.survey.prevPage()
    },
    submit () {
      this.survey.doComplete()
    },
    onSave (sender, options) {
      console.log('on save')
    },
    onChange (sender, options) {
      this.$emit('input', this.survey.data)
    }
  }
}
</script>
