import { Component, Vue } from 'vue-property-decorator'

@Component
export class PageMixin extends Vue {
  public get title() {
    return this.$options.name
  }
  public mounted() {
    this.$store.commit('navigation/setTitle', this.title)
  }
  public updated() {
    this.$store.commit('navigation/setTitle', this.title)
  }
}
