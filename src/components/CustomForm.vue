<template lang="pug">
  q-page(class="flex flex-center")
    div {{survey.title}}
    survey(:survey="survey", :css="css")
    q-btn(v-if="!survey.isFirstPage" @click="previous()") previous
    q-btn(v-if="!survey.isLastPage && !survey.isCurrentPageHasErrors" @click="next()") next
    //- q-btn( @click="reset()") reset
    //- q-btn(v-if="survey.isLastPage" @click="submit()") submit
</template>

<style></style>

<script>
import * as Survey from 'survey-vue'
// Survey.StylesManager.applyTheme('default')
Survey.StylesManager.applyTheme('darkblue')
// var defaultThemeColors = Survey.StylesManager.ThemeColors['default']
// defaultThemeColors["$main-color"] = "#7ff07f";
// defaultThemeColors["$main-hover-color"] = "#6fe06f";
// defaultThemeColors["$text-color"] = "#4a4a4a";
// defaultThemeColors["$header-color"] = "#7ff07f";
// defaultThemeColors["$header-background-color"] = "#4a4a4a";
// defaultThemeColors["$body-container-background-color"] = "#f8f8f8";
// Survey.StylesManager.applyTheme()

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
    value: {},
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let jsonSurvey = { ...defaultOptions, ...this.schema }
    // TODO make the initial schema dynamic (with a 'watch'?)
    let survey = new Survey.Model(jsonSurvey)
    survey.data = this.value
    survey.onComplete.add(this.onSave)
    survey.onValueChanged.add(this.onChange)
    survey.onCurrentPageChanged.add(this.onPageChange)
    this.$emit('last-page', survey.isLastPage)
    survey.focusOnFirstError = false
    survey.mode = this.readonly ? 'display' : 'edit'
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
    },
    onPageChange () {
      this.$emit('last-page', this.survey.isLastPage)
    }
  },
  watch: {
    readonly (newValue) {
      this.survey.mode = newValue ? 'display' : 'edit'
    }
  },
  created () {
    this.$root.$on('reset', this.reset)
    this.$root.$on('next', this.next)
    this.$root.$on('previous', this.previous)
  }
}
</script>
