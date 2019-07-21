<template lang="pug">
  q-field(:label="title" stack-label)
    //- div(v-if='element.hasTitleOnLeftTop', :class="element.hasTitleOnLeft ? 'title-left' : ''")
    //-   h5(v-if='element.hasTitle', :class='element.cssClasses.title')
    //-     span(v-if='element.no', style='position: static;', :class='element.cssClasses.number') {{element.no}}
    //-     span(v-if='element.no', style='position: static;') .
    //-     survey-string(:loc-string='element.locTitle')
    //-   div(v-if='!element.locDescription.isEmpty', :class='element.cssClasses.description')
    //-     survey-string(:loc-string='element.locDescription')
    //- div(:class="element.hasTitleOnLeft ? 'content-left' : ''")
    template(v-slot:hint)
      div(v-if='!element.locDescription.isEmpty')
        survey-string(:loc-string='element.locDescription')
    template(v-slot:error)
      div TODO errors
      survey-errors(v-if='hasErrorsOnTop', :question='element', :location="'top'")
      survey-errors(v-if='hasErrorsOnBottom', :question='element', :location="'bottom'")
    template(v-slot:control)
      //- div {{getWidgetComponentName(element)}}
      component(:is="'p-'+getWidgetComponentName(element)", :question='element')
      div(v-if='element.hasComment')
        div {{element.commentText}}
        survey-other-choice(:question='element')
      //- h5(v-if='element.hasTitleOnBottom', :class='element.cssClasses.title')
      //-   span(v-if='element.no', style='position: static;', :class='element.cssClasses.number') {{element.no}}
      //-   span(v-if='element.no', style='position: static;') .
      //-   survey-string(:loc-string='element.locTitle')
      //- div(v-if='!element.locDescription.isEmpty', v-show='element.hasTitleOnBottom')
      //-   survey-string(:loc-string='element.locDescription')
</template>
<script>
import { SurveyElementVue } from 'survey-vue'
import { QField, QIcon } from 'quasar'
export default {
  extends: SurveyElementVue,
  name: 'SurveyElement',
  components: { QField, QIcon },
  computed: {
    title () {
      return (
        (this.element.no ? String(this.element.no) + '. ' : '') +
        this.element.locTitle.renderedHtml
      )
    }
  }
}
</script>
