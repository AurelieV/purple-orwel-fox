const path = require('path')
import jsonImporter from 'node-sass-json-importer'

module.exports = ({ config }) => {
  Object.assign(config.resolve.alias || {}, {
    '@': path.resolve(__dirname, '../src'),
    '@@': path.resolve(__dirname, '../'),
    assets: path.resolve(__dirname, '../src/assets'),
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

  config.watchOptions = {
    ignored: /node_modules/,
  }

  return config
}
