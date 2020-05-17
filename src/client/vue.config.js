const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './node_modules/sass-rem/_rem.scss'),
        path.resolve(__dirname, './src/styles/utils/_variables.scss'),
        path.resolve(__dirname, './src/styles/utils/**/!(_variables).scss'),
      ],
    },
  },
}
