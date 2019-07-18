<template lang="pug">
  q-field(
    :label="$t(form +'.labels.'+name)"
    stack-label)
    template(v-slot:control)
      q-list(
        class="col-12"
        highlight)
        q-item(
          v-for="cursor in value"
          :to="path+'/'+cursor.id"
          :key="cursor.id") {{ itemLabel(cursor) }}
        q-item(:to="path+'/create'")
          q-item-section(avatar)
            q-icon(name="fas fa-plus")
          q-item-section {{$t(form +'.actions.'+name+'.create')}}
</template>
<script>
import { QField, QList, QItem, QItemSection, QIcon } from 'quasar'
import { icon } from './config'
import Handlebars from 'handlebars'
export default {
  extends: QField,
  components: {
    QField,
    QList,
    QItem,
    QItemSection,
    QIcon
  },
  props: {
    form: String,
    name: String,
    itemLabelTemplate: {
      type: String,
      default: '{{name}}'
    },
    path: String,
    create: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    icon () {
      return icon(this.form, this.name)
    }
  },
  methods: {
    itemLabel (cursor) {
      var template = Handlebars.compile(this.itemLabelTemplate)
      return template(cursor)
    }
  }
}
</script>
