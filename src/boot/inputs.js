/**
 * Plugin that includes all the custom form inputs
 */
import JsonInput from 'components/JsonInput.vue'
import PInput from 'components/PInput.vue'
import PSelect from 'components/PSelect.vue'
// Code Mirror imports
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
window.jsonlint = require('jsonlint-mod')
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/json-lint.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/edit/matchbrackets.js'
const cmOptions = {
  tabSize: 2,
  mode: 'application/json',
  annotateScrollbar: true,
  lint: true,
  matchBrackets: true,
  styleActiveLine: true,
  lineWrapping: true,
  gutters: ['CodeMirror-lint-markers']
}

export default ({ app, router, Vue, store }) => {
  Vue.use(VueCodemirror, { options: cmOptions })
  Vue.component('json-input', JsonInput)
  Vue.component('p-input', PInput)
  Vue.component('p-select', PSelect)
}
