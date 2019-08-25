<template lang="pug">
q-chip(v-if="element" :to="linkToElement()")
    div {{label}}
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ElementContainerMixin } from 'src/boot/hasura'

@Component
export default class Chip extends Mixins(ElementContainerMixin) {}
</script>
