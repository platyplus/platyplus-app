export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    data () {
      return {
        $from: null
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$from = from
      })
    }
  })
}
