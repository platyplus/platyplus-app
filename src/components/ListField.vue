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
<script lang="ts">
import { QField, QList, QItem, QItemSection, QIcon } from 'quasar'
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { FieldMixin } from './config'
// import Handlebars from 'handlebars/dist/cjs/handlebars' // TODO TS
import Handlebars from 'handlebars'

@Component({
  components: {
    QField,
    QList,
    QItem,
    QItemSection,
    QIcon
  }
})
export default class PField extends mixins(FieldMixin, QField) {
  @Prop({
    type: String,
    default: '{{name}}'
  })
  readonly itemLabelTemplate?: string
  @Prop(String) readonly path?: string
  @Prop({
    type: Boolean,
    default: true
  })
  readonly create?: boolean
  @Prop(String) readonly createSuffix?: string

  itemLabel(cursor: {}) {
    var template = Handlebars.compile(this.itemLabelTemplate)
    return template(cursor)
  }
}
</script>
