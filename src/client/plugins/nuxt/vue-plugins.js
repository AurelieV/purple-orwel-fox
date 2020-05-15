import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { firestorePlugin } from 'vuefire'

import TwitchPlugin from '../vue/twitch'
import FoxApiPlugin from '../vue/fox-api'
import FirebasePlugin from '../vue/firebase'

export default function(context) {
  const { store, app } = context
  Vue.use(firestorePlugin)
  Vue.use(TwitchPlugin, { store })
  const client = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    baseURL: 'https://twitch-api.purple-fox.fr', // TODO: change it depending on prod/dev
  })
  Vue.use(FoxApiPlugin, { store, client })
  Vue.use(FirebasePlugin, { store, firebaseAuth: app.$firebaseAuth, client })
}
