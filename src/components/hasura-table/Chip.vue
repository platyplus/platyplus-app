<template lang="pug">
q-chip(v-if="element" :to="'/data/'+tableName + '/'+ element.id" :key="element.id")
    div {{label}}
div(v-else) Element does not exist
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ElementContainerMixin } from 'src/boot/hasura'

@Component
export default class HasuraTableElement extends Mixins(ElementContainerMixin) {}
</script>
