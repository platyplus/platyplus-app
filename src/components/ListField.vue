<template lang="pug">
  q-field(
    :readonly="readonly"
    :label="$t(form +'.labels.'+name)"
    stack-label)
    template(v-if="icon" v-slot:prepend)
      q-icon(:name="'fas fa-'+icon")
    template(v-slot:control)
      q-list(
        dense
        class="col-12"
        highlight)
        q-item(
          v-for="cursor in value"
          :to="path+'/'+cursor.id"
          :key="cursor.id") {{ itemLabel(cursor) }}
        q-item(:to="path+(createSuffix ? '/'+ createSuffix : '')+'/create'")
          q-item-section(avatar)
            q-icon(name="fas fa-plus")
          q-item-section {{$t(form +'.actions.'+name+'.create')}}
</template>
<script>
import { QField, QList, QItem, QItemSection, QIcon } from 'quasar'
import { FieldMixin } from './config'
import Handlebars from 'handlebars/dist/cjs/handlebars'
export default {
  extends: QField,
  mixins: [FieldMixin],
  components: {
    QField,
    QList,
    QItem,
    QItemSection,
    QIcon
  },
  props: {
    itemLabelTemplate: {
      type: String,
      default: '{{name}}'
    },
    path: String,
    create: {
      type: Boolean,
      default: true
    },
    createSuffix: String
  },
  methods: {
    itemLabel (cursor) {
      var template = Handlebars.compile(this.itemLabelTemplate)
      return template(cursor)
    }
  }
}
</script>
