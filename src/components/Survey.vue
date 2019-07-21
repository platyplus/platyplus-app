<template lang="pug">
form(onsubmit='return false;')
  div(v-if='hasTitle')
    h4 {{locString(survey.locTitle)}}
    h5 {{locString(survey.locDescription)}}
  template(v-if="survey.state === 'starting'")
    div(v-if="survey.isNavigationButtonsShowing === 'top' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
      input(type='button', :value='survey.startSurveyText', :class="getNavBtnClasses('start')", @click='start')
    survey-page(:id='survey.startedPage.id', :survey='survey', :page='survey.startedPage', :css='css')
      div(v-if="survey.isNavigationButtonsShowing === 'bottom' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
        input(type='button', :value='survey.startSurveyText', :class="getNavBtnClasses('start')", @click='start')
  template(v-if="survey.state === 'running'")
    survey-timerpanel(v-if='survey.isTimerPanelShowingOnTop', :survey='survey', :css='css')
    div(v-if="survey.isNavigationButtonsShowing === 'top' || survey.isNavigationButtonsShowing === 'both'", :class='css.footer')
      input(type='button', :value='survey.pagePrevText', v-show='!survey.isFirstPage && survey.isShowPrevButton', :class="getNavBtnClasses('prev')", @click='prevPage')
      input(type='button', :value='survey.pageNextText', v-show='!survey.isLastPage', :class="getNavBtnClasses('next')", @click='nextPage')
      input(v-if='survey.isEditMode', type='button', :value='survey.completeText', v-show='survey.isLastPage', :class="getNavBtnClasses('complete')", @click='completeLastPage')
    survey-timerpanel(v-if='survey.isTimerPanelShowingOnBottom', :survey='survey', :css='css')
    q-stepper(v-model="survey.currentPageNo" header-nav
      ref="stepper" color="primary" animated alternative-labels :contracted="$q.screen.lt.md")
      template(v-slot:navigation)
        q-stepper-navigation
          q-btn(@click="prevPage" v-show='!survey.isFirstPage && survey.isShowPrevButton' :label="survey.pagePrevText")
          q-btn(@click="nextPage" v-show='!survey.isLastPage' :label="survey.pageNextText")
          q-btn(v-if='survey.isEditMode' @click="completeLastPage" v-show='survey.isLastPage' :label="survey.completeText")
      template(v-slot:default)
        q-step(v-for="(page, index) in survey.visiblePages" :key="index"
          :name="index"
          :title="locString(page.locTitle)"
          :prefix="String(index+1)"
          :done="(index < lastValidatedPage) || readonly"
          :header-nav="(index <= lastValidatedPage) || readonly")
          survey-string(:locString="page.locDescription")
          div(v-for="(row, index) in page.rows" v-if="row.visible" :key="page.id + '_' + index")
            p-survey-row(:row="row" :survey="survey")
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
import { QStepper, QStepperNavigation, QStep } from 'quasar'
import * as SurveyVue from 'survey-vue'
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
  showTitle: true
  // showNavigationButtons: 'none',
  // checkErrorsMode: 'onValueChanged',
  // showPageTitles: true
  // showProgressBar: 'bottom'
  // goNextPageAutomatic: true // TODO put as a settings in the encounter type
}

export default {
  name: 'PSurvey',
  components: { QStepper, QStep, QStepperNavigation },
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
    survey.onCurrentPageChanged.add(this.onChangePage)
    survey.onValidatedErrorsOnCurrentPage.add(this.onErrorsCheck)
    survey.mode = this.readonly ? 'display' : 'edit'
    survey.css = css
    return {
      survey,
      lastValidatedPage: 0,
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
    onChangePage (sender, options) {
      this.lastValidatedPage = Math.max(
        this.lastValidatedPage,
        this.survey.currentPageNo
      )
    },
    onErrorsCheck (sender, options) {
      if (options.errors.length > 0) {
        this.lastValidatedPage = this.survey.currentPageNo
      } else {
        this.lastValidatedPage = Math.max(
          this.lastValidatedPage,
          this.survey.currentPageNo
        )
      }
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
      // if (!this.survey.nextPage()) {
      //   this.lastValidatedPage = this.survey.currentPageNo
      // }
      this.survey.nextPage()
    },
    completeLastPage () {
      this.survey.completeLastPage()
    },
    doTrySaveAgain () {
      this.survey.doComplete()
    },
    locString (str) {
      return str.renderedHtml
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
