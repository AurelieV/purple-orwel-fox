require('@babel/register')({
  presets: ['@babel/preset-env'],
})
module.exports = require('./webpack.config.es6.js')
