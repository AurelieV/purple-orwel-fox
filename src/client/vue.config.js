const path = require('path')
const jsonImporter = require('node-sass-json-importer')

module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://localhost:3000',
        secure: false,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          importer: jsonImporter(),
        },
      },
    },
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './node_modules/sass-rem/_rem.scss'),
        path.resolve(__dirname, './src/styles/utils/variables/_variables.scss'),
        path.resolve(__dirname, './src/styles/utils/{!(variables),}/*.scss'),
      ],
    },
  },
}
