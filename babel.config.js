module.exports = {
  presets: ['@quasar/babel-preset-app'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/transform-runtime',
      {
        regenerator: false
      }
    ],
    [
      'wildcard',
      {
        exts: ['js', 'es6', 'es', 'jsx', 'javascript', 'vue'],
        noModifyCase: true
      }
    ]
  ]
}
