const fs = require('fs')
const path = require('path')

export default {
  mode: 'universal',
  head: {
    title: 'Purple Orwel Fox (Twitch Extension)',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  loading: { color: '#fff' },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.crt')),
    },
    port: 8080,
  },
  css: ['@/styles/global.scss'],
  plugins: ['@/plugins/nuxt/firebase.client', '@/plugins/nuxt/vue-plugins'],
  modules: ['@nuxtjs/style-resources'],
  styleResources: {
    scss: [
      '~~/node_modules/sass-rem/_rem.scss',
      '~/styles/utils/_variables.scss',
      '~/styles/utils/**/!(_variables).scss',
    ],
  },
  generate: {
    routes: ['/twitch/panel'],
  },
}
