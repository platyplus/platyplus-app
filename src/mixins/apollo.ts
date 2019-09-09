import { Component, Watch, Vue } from 'vue-property-decorator'

/**
 * * Uses the 'loadingQueries' key with Apollo and
 * * shows/hides the Quasar loading plugin spinner
 */
@Component
export class ApolloMixin extends Vue {
  public loadingQueries = 0

  @Watch('loadingQueries')
  public onLoadingQueriesChanged(newValue: number) {
    if (newValue > 0) {
      this.$q.loading.show()
    } else {
      this.$q.loading.hide()
    }
  }

  public beforeDestroy() {
    this.$q.loading.hide()
  }
}
