<template lang="pug">
  q-page(
    v-if="authenticated"
    padding
    class="justify-center")
    //- q-uploader(:url="url")
    input(type="file" @change="importXlsForms")

</template>

<style>
</style>

<script>
import gql from 'graphql-tag'
export default {
  name: 'PageImportExport',
  methods: {
    async importXlsForms (ev) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: gql`
            mutation import($file: Upload!) {
              importXlsForms(file: $file) {
                status
                message
              }
            }
          `,
          variables: {
            file: ev.target.files[0]
          }
        })
        console.log(data.importXlsForms)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
