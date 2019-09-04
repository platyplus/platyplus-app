<template lang="pug">
q-form(autofocus @reset="reset" @submit="submit")
  validation-observer(ref="validator")
    slot(name="before-fields" :element="element")
    slot(name="fields" :element="element")
      component(v-for="property, key in fields(action)"
        :key="'field-'+key"
        :is="componentName(property, 'h-edit-field')"
        :property="property"
        :element="element"
        :tableClass="property.class"
        v-model="form[property.name]")
    slot(name="after-fields" :element="element")
    slot(name="before-actions" :element="element")
    slot(name="actions" :element="element")
      q-btn(v-if="canSave" v-t="'save'" type="submit")
      q-btn(v-t="'reset'" type="reset")
      q-btn(v-if="true" v-t="'cancel'" @click="previous()")
    slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ValidationObserver } from 'vee-validate'
import { FormManagerMixin } from 'src/boot/hasura'
import Text from './fields/edit/Text.vue'
import BooleanField from './fields/edit/Boolean.vue'
import ArrayField from './fields/edit/Array.vue'
import SimpleManyToManyField from './fields/edit/SimpleManyToMany.vue'
import ObjectField from './fields/edit/Object.vue'

@Component({
  components: {
    ValidationObserver,
    'h-edit-field-text': Text,
    'h-edit-field-simple-many-to-many': SimpleManyToManyField,
    'h-edit-field-nested-many-to-many': ArrayField,
    'h-edit-field-complete-many-to-many': ArrayField,
    'h-edit-field-nested-many-to-one': ArrayField,
    'h-edit-field-complete-many-to-one': ArrayField,
    'h-edit-field-nested-object': ObjectField,
    'h-edit-field-complete-object': ObjectField,
    'h-edit-field-bool': BooleanField
  }
})
export default class EditElementDispatcher extends Mixins(FormManagerMixin) {
  previous() {
    this.isNew ? this.$router.go(-1) : this.read()
  }
}
</script>
