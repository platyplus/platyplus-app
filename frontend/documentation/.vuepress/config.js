module.exports = {
  dest: 'dist',
  title: 'PlatyPlus',
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'en-US', // this will be set as the lang attribute on <html>
      //   title: 'PlatyPlus',
      description: 'Platyplus documentation'
    },
    '/fr/': {
      lang: 'fr-FR',
      // title: 'PlatyPlus',
      description: 'Documentation de Platyplu'
    }
  },
  themeConfig: {
    // Assumes GitHub. Can also be a full GitLab url.
    repo: 'platyplus/platyplus',
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    // repoLabel: 'GitHub',
    // Optional options for generating "Edit this page" link
    // if your docs are in a different repo from your main project:
    // docsRepo: 'vuejs/vuepress',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Installation', link: '/installation/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'Developpers', link: '/dev/' }
        ],
        sidebar: [
          '/',
          '/installation/',
          '/guide/',
          {
            title: 'Developpers', // required
            path: '/dev/', // optional, which should be a absolute path.
            collapsable: false, // optional, defaults to true
            sidebarDepth: 1, // optional, defaults to 1
            children: ['/dev/installation', '/dev/schema', '/dev/store']
          }
        ]
      },
      '/fr/': {
        selectText: 'Langues',
        label: 'Français',
        lastUpdated: 'Dernière mise à jour',
        editLinkText: 'Modifier cette page sur GitHub',
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Guide', link: '/fr/guide/' },
          { text: 'Developpeurs', link: '/fr/dev/' }
        ],
        sidebar: ['/fr/', '/fr/guide/', '/fr/dev/']
      }
    },
    algolia: {
      apiKey: '53493c81f4ecb2981b1cf6a57f9d3988',
      indexName: 'platyplus'
    }
  },
  plugins: [
    '@vuepress/pwa',
    '@vuepress/active-header-links',
    '@vuepress/back-to-top',
    '@vuepress/nprogress',
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-142387636-1'
      }
    ]
  ]
}
