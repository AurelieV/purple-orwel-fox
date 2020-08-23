const path = require('path')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
import jsonImporter from 'node-sass-json-importer'

module.exports = ({ config }) => {
  Object.assign(config.resolve.alias || {}, {
    '@': path.resolve(__dirname, '../src'),
    '@@': path.resolve(__dirname, '../'),
    assets: path.resolve(__dirname, '../src/assets'),
  })

  config.module.rules = config.module.rules.filter(rule => {
    return !rule.test.toString().includes('svg')
  })

  config.module.rules.push({
    test: /\.scss$/,
    loaders: [
      'style-loader',
      'css-loader?sourceMap',
      {
        loader: 'sass-loader?sourceMap',
        options: { sassOptions: { importer: jsonImporter() } },
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../node_modules/sass-rem/_rem.scss'),
            path.resolve(__dirname, '../src/styles/utils/variables/_variables.scss'),
            path.resolve(__dirname, '../src/styles/utils/{!(variables),}/*.scss'),
          ],
        },
      },
    ],
  })

  config.plugins.push(
    new SVGSpritemapPlugin(path.resolve(__dirname, '../src/assets/icons/**/*.svg'), {
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
    })
  )

  config.watchOptions = {
    ignored: /node_modules/,
  }

  return config
}
