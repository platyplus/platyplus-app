<template lang="pug">
  q-page(class="flex flex-center")
    div(:class='css.root')
      form(onsubmit='return false;')
        .sv_custom_header
        .sv_container
          div(v-if='hasTitle', :class='css.header')
            h3
              survey-string(:locstring='survey.locTitle')
            h5
              survey-string(:locstring='survey.locDescription')
          template(v-if="survey.state === 'starting'")
            div(:class='css.body')
              div(v-if="survey.isNavigationButtonsShowing === 'top' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
                input(type='button', :value='survey.startSurveyText', :class="getNavBtnClasses('start')", @click='start')
              survey-page(:id='survey.startedPage.id', :survey='survey', :page='survey.startedPage', :css='css')
                div(v-if="survey.isNavigationButtonsShowing === 'bottom' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
                  input(type='button', :value='survey.startSurveyText', :class="getNavBtnClasses('start')", @click='start')
          template(v-if="survey.state === 'running'")
            div(:class='css.body')
              survey-progress(v-if='survey.isShowProgressBarOnTop', :survey='survey', :css='css')
              survey-timerpanel(v-if='survey.isTimerPanelShowingOnTop', :survey='survey', :css='css')
              div(v-if="survey.isNavigationButtonsShowing === 'top' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
                input(type='button', :value='survey.pagePrevText', v-show='!survey.isFirstPage && survey.isShowPrevButton', :class="getNavBtnClasses('prev')", @click='prevPage')
                input(type='button', :value='survey.pageNextText', v-show='!survey.isLastPage', :class="getNavBtnClasses('next')", @click='nextPage')
                input(v-if='survey.isEditMode', type='button', :value='survey.completeText', v-show='survey.isLastPage', :class="getNavBtnClasses('complete')", @click='completeLastPage')
              survey-page(:id='survey.currentPage.id', :survey='survey', :page='survey.currentPage', :css='css')
              survey-timerpanel(v-if='survey.isTimerPanelShowingOnBottom', :survey='survey', :css='css')
              survey-progress(style='margin-top: 1em', v-if='survey.isShowProgressBarOnBottom', :survey='survey', :css='css')
              div(v-if="survey.isNavigationButtonsShowing === 'bottom' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
                input(type='button', :value='survey.pagePrevText', v-show='!survey.isFirstPage && survey.isShowPrevButton', :class="getNavBtnClasses('prev')", @click='prevPage')
                input(type='button', :value='survey.pageNextText', v-show='!survey.isLastPage', :class="getNavBtnClasses('next')", @click='nextPage')
                input(v-if='survey.isEditMode', type='button', :value='survey.completeText', v-show='survey.isLastPage', :class="getNavBtnClasses('complete')", @click='completeLastPage')
          div(v-if='hasCompletedPage')
            div(v-html='survey.processedCompletedHtml', :class='getCompletedPageClasses()')
            div(v-if="survey.completedState != ''", :class='css.saveData.root')
              div(:class='getCompletedStateClasses()')
                span {{survey.completedStateText}}
                input(type='button', v-if="survey.completedState == 'error'", :value="survey.getLocString('saveAgainButton')", @click='doTrySaveAgain', :class='css.saveData.saveAgainButton')
          div(v-if="survey.state === 'completedbefore'", :class='css.body', v-html='survey.processedCompletedBeforeHtml')
          div(v-if="survey.state === 'loading'", :class='css.body', v-html='survey.processedLoadingHtml')
          div(v-if="survey.state === 'empty'", :class='css.bodyEmpty') {{survey.emptySurveyText}}

    //- div {{survey.title}}
    //- survey(:survey="survey", :css="css")
    //- q-btn(v-if="!readonly" @click="$emit('cancel')" v-t="'cancel'")
    //- q-btn(v-if="!survey.isFirstPage" @click="prevPage" v-t="'previous'")
    //- q-btn(v-if="!survey.isLastPage" @click="nextPage" v-t="'next'")
    //- q-btn(v-else-if="!readonly" @click="completeLastPage" v-t="'save'")
    //- q-btn(v-if="!readonly" @click="reset()" v-t="'reset'")
</template>

<style></style>

<script>
import * as SurveyVue from 'survey-vue'
import Vue from 'vue'
Vue.use(SurveyVue)
// SurveyVue.StylesManager.applyTheme('default')
SurveyVue.StylesManager.applyTheme('darkblue')
// var defaultThemeColors = SurveyVue.StylesManager.ThemeColors['default']
// defaultThemeColors["$main-color"] = "#7ff07f";
// defaultThemeColors["$main-hover-color"] = "#6fe06f";
// defaultThemeColors["$text-color"] = "#4a4a4a";
// defaultThemeColors["$header-color"] = "#7ff07f";
// defaultThemeColors["$header-background-color"] = "#4a4a4a";
// defaultThemeColors["$body-container-background-color"] = "#f8f8f8";
// SurveyVue.StylesManager.applyTheme()

// TODO https://github.com/surveyjs/survey-library/blob/master/src/defaultCss/cssstandard.ts
const css = {}

const defaultOptions = {
  showTitle: true,
  // showNavigationButtons: 'none',
  showProgressBar: 'bottom',
  goNextPageAutomatic: true
}

export default {
  name: 'PSurvey',
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
    let survey = new SurveyVue.Model(jsonSurvey)
    survey.data = this.value
    survey.onComplete.add(this.onSave)
    survey.onValueChanged.add(this.onChange)
    survey.mode = this.readonly ? 'display' : 'edit'
    survey.css = css
    return {
      survey,
      initialValues: this.value
    }
  },
  methods: {
    reset () {
      this.survey.clear()
      this.survey.data = this.initialValues
      this.$emit('input', this.initialValues)
      this.$emit('reset')
    },
    onSave (sender, options) {
      this.$emit('save')
    },
    onChange (sender, options) {
      this.$emit('input', this.survey.data)
    },
    getNavBtnClasses (btnType) {
      const btnClass = this.css.navigation[btnType]
      return this.css.navigationButton + ' ' + btnClass
    },
    getCompletedPageClasses () {
      var css = this.css
      return css.body + ' ' + css.completedPage
    },
    getCompletedStateClasses () {
      return this.css.saveData[this.survey.completedState]
    },
    start () {
      this.survey.start()
    },
    prevPage () {
      this.survey.prevPage()
    },
    nextPage () {
      this.survey.nextPage()
    },
    completeLastPage () {
      this.survey.completeLastPage()
    },
    doTrySaveAgain () {
      this.survey.doComplete()
    }
  },
  computed: {
    hasTitle () {
      return !!this.survey.title && this.survey.showTitle
    },
    hasCompletedPage () {
      return this.survey.showCompletedPage && this.survey.state === 'completed'
    },
    css () {
      return this.survey.css
    }
  },
  watch: {
    readonly (newValue) {
      this.survey.mode = newValue ? 'display' : 'edit'
    }
  }
}
</script>
