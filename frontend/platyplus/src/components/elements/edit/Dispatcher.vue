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
import { FormManagerMixin } from '../../../mixins'
import Text from './fields/Text.vue'
import BooleanField from './fields/Boolean.vue'
import ManyToManyField from './fields/ManyToMany.vue'
import Select from './fields/Select.vue'
import SelectMultiple from './fields/SelectMultiple.vue'

@Component({
  components: {
    ValidationObserver,
    'h-edit-field-text': Text,
    'h-edit-field-many-to-many': ManyToManyField,
    'h-edit-field-nested-many-to-many': ManyToManyField, // TODO
    'h-edit-field-complete-many-to-many': ManyToManyField, // TODO
    'h-edit-field-one-to-many': SelectMultiple,
    'h-edit-field-nested-one-to-many': SelectMultiple, // TODO
    'h-edit-field-complete-one-to-many': SelectMultiple, // TODO
    'h-edit-field-many-to-one': Select,
    'h-edit-field-nested-many-to-one': Select, // TODO
    'h-edit-field-complete-many-to-one': Select, // TODO
    'h-edit-field-bool': BooleanField
  }
})
export default class EditElementDispatcher extends Mixins(FormManagerMixin) {
  previous() {
    this.isNew ? this.$router.go(-1) : this.read()
  }
}
</script>
