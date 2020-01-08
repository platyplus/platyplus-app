<template lang="pug">
q-form(autofocus @reset="reset" @submit="submit")
  validation-observer(ref="validator")
    slot(name="before-fields" :element="element")
    slot(name="fields" :element="element")
      component(v-for="property, key in fields(action)"
        :key="'field-'+key"
        :is="componentName(property, 'h-edit-field')"
        :property="property.name"
        :element="element"
        :table="table"
        v-model="form[property.name]")
    slot(name="after-fields" :element="element")
    slot(name="before-actions" :element="element")
    slot(name="actions" :element="element")
      q-btn(v-if="canSave" :label="$t('save')" type="submit")
      q-btn(:label="$t('reset')" type="reset")
      q-btn(v-if="true" :label="$t('cancel')" @click="previous()")
    slot(name="after-actions" :element="element")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ValidationObserver } from 'vee-validate'
import { FormManagerMixin } from '../../../mixins'

@Component({
  components: {
    ValidationObserver
  }
})
export default class EditElementDispatcher extends Mixins(FormManagerMixin) {
  previous() {
    this.isNew ? this.$router.go(-1) : this.read()
  }
}
</script>
