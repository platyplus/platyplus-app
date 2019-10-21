import { Component, Vue } from 'vue-property-decorator'

@Component
export class PageMixin extends Vue {
  title = 'title'
  public mounted() {
    this.$store.commit('navigation/setTitle', this.$t(this.title))
  }
  public updated() {
    this.$store.commit('navigation/setTitle', this.$t(this.title))
  }
}
