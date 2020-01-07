import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export class HasuraMixin extends Vue {
  @Prop(String) public readonly table!: string

  public get metadata() {
    return this.$metadata(this.table)
  }
}
