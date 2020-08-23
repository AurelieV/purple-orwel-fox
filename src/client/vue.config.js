const path = require('path')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
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

  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({
        svgo: {
          plugins: [{ cleanupIDs: false }, { collapseGroups: false }],
        },
      })
  },

  configureWebpack: {
    plugins: [
      new SVGSpritemapPlugin(path.resolve(__dirname, './src/assets/icons/**/*.svg'), {
        output: {
          filename: 'icons.svg',
          svgo: {
            plugins: [
              {
                removeAttrs: {
                  attrs: ['stroke', 'fill'],
                },
              },
            ],
          },
        },
        sprite: {
          generate: {
            title: false,
          },
        },
      }),
    ],
  },
}
