// Configuration for your app

// eslint-disable-next-line no-undef
module.exports = function(ctx) {
  return {
    // Quasar looks for *.js files by default
    sourceFiles: {
      router: 'src/router/index.ts',
      store: 'src/store/index.ts'
    },
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      // ! The order of the modules counts and therefore should remain the same!
      'apollo', // TODO merge with hasura
      'user',
      // 'auth',
      'navigation',
      'hasura',
      // 'moment', // ! Do not use. Use rather the built-in quasar helpers
      'i18n',
      'layout', // TODO merge with?
      'inputs'
      // 'form', // TODO TS
      // 'formGenerator' // TODO TS
    ],
    css: ['app.styl'],
    extras: [
      'roboto-font',
      // 'material-icons', // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5'
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QAvatar',
        'QLayout',
        'QHeader',
        'QChip',
        'QCard',
        'QCardActions',
        'QCardSection',
        'QDate',
        'QDialog',
        'QDrawer',
        'QField',
        'QForm',
        'QPageContainer',
        'QPage',
        'QPageSticky',
        'QPopupProxy',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnDropdown',
        'QSelect',
        'QIcon',
        'QList',
        'QInput',
        'QItem',
        'QItemLabel',
        'QItemSection',
        'QSeparator',
        'QToggle',
        'QTree'
      ],

      directives: ['Ripple', 'ClosePopup'],

      // Quasar plugins
      plugins: ['Notify'],

      iconSet: 'fontawesome-v5',
      lang: 'en-us' // Quasar language
    },

    supportIE: true,
    build: {
      scopeHoisting: true,
      env: {
        API: JSON.stringify(
          ctx.dev
            ? 'graphql.localhost/v1/graphql'
            : 'graphql.platyplus.io/v1/graphql'
        )
      },
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      analyze: {
        analyzerMode: 'static',
        reportFilename: 'report.html' // TODO avoid to put the file in the dist's directory
      },
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.devtool = 'inline-module-source-map'
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
        cfg.module.rules.push({
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        })
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias
          handlebars: 'handlebars/dist/handlebars.min.js'
        }
      }
    },

    devServer: {
      public: '0.0.0.0:80',
      // https: true,
      // port: 8080,
      open: false // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        /*eslint-disable @typescript-eslint/camelcase */
        background_color: '#ffffff',
        theme_color: '#027be3',
        /*eslint-enable @typescript-eslint/camelcase */
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      // extendWebpack(cfg) {
      // do something with Electron main process Webpack cfg
      // chainWebpack also available besides this extendWebpack
      // },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      }
    }
  }
}
