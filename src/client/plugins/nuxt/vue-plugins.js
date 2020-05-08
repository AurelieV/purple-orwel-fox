import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { firestorePlugin } from 'vuefire'

import TwitchPlugin from '../vue/twitch'
import FoxApiPlugin from '../vue/fox-api'

export default function(context) {
  Vue.use(TwitchPlugin, { store: context.store })
  const client = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    baseURL: 'https://localhost:3000', // TODO: change it depending on prod/dev
  })
  Vue.use(FoxApiPlugin, { store: context.store, client })
  Vue.use(firestorePlugin)
}
