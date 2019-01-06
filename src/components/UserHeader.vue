<template lang="pug">
  q-layout-header
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
          q-icon(name="fas fa-bars")
        q-toolbar-title Platyplus
          div(slot="subtitle") TODO: current page
        q-select(
          hide-underline
          :options="options"
          v-model="lang")
        q-btn(v-if="authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")
</template>

<script>
export default {
  name: 'UserHeader',
  data () {
    return {
      lang: this.$q.i18n.lang
    }
  },
  watch: {
    lang (lang) {
      // dynamic import, so loading on demand only
      import(`quasar-framework/i18n/${lang}`).then(language => {
        this.$q.i18n.set(language.default)
        this.$i18n.setLocaleMessage(lang, require(`i18n/${lang}`).default)
        this.$i18n.locale = lang
      })
    }
  },
  computed: {
    options () {
      return [{ label: '🇬🇧', value: 'en-uk' }, { label: '🇫🇷', value: 'fr' }]
    }
  },
  methods: {
    toggleDrawer () {
      this.$store.dispatch('navigation/toggleDrawer')
    },
    async logout (e) {
      try {
        await this.$q.dialog({
          title: this.$t('logout.title'),
          message: this.$t('logout.message'),
          // color: 'warning',
          ok: this.$t('yes'),
          cancel: this.$t('no')
        })
        this.$store.dispatch('authentication/logout')
      } catch (error) {}
    }
  }
}
</script>

<style>
</style>
