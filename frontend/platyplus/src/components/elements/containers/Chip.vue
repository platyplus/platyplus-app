<template lang="pug">
q-chip(:to="linkToElement()")
    div {{label}}
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ElementContainerMixin } from '../../../mixins'

@Component
export default class Chip extends Mixins(ElementContainerMixin) {}
</script>
