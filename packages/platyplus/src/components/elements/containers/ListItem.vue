<template lang="pug">
q-item(v-if="element" :to="linkToElement()" exact)
    q-item-section {{label}}
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ElementContainerMixin } from 'src/mixins'

@Component
export default class HasuraTableElement extends Mixins(ElementContainerMixin) {}
</script>
