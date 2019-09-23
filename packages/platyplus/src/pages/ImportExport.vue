<template lang="pug">
q-page(
  v-if="$authenticated"
  padding
  class="justify-center")
  //- q-uploader(:url="url")
  input(type="file" @change="importXlsForms")
  pre {{forms}}
</template>

<style></style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { PageMixin } from '../mixins'
@Component
export default class ImportExport extends Mixins(PageMixin) {
  get title() {
    return 'Import/Export'
  }
  forms = {}
  async importXlsForms(ev: Event) {
    console.log(ev)
    // TODO TS
    // try {
    //   const file = ev.target.files[0]
    //   ev.target.value = ''
    //   const { data } = await this.$apollo.mutate({
    //     mutation: gql`
    //       mutation import($file: Upload!) {
    //         importXlsForms(file: $file) {
    //           status
    //           message
    //           content
    //         }
    //       }
    //     `,
    //     variables: {
    //       file
    //     }
    //   })
    //   this.forms = data.importXlsForms.content
    // } catch (e) {
    //   console.log(e)
    // }
  }
}
</script>
