import Vue from 'vue'
import Component from 'vue-class-component'
import { Route } from 'vue-router'

Component.registerHooks(['beforeRouteEnter'])

/**
 * * Exposes the previous route to any component through the $from property
 */

@Component
export class RouterMixin extends Vue {
  public $from = undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteEnter(to: Route, from: Route, next: any) {
    next((vm: Vue) => {
      vm.$from = from
    })
  }
}
