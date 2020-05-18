import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { firestorePlugin } from 'vuefire'

import router from './router'
import store from './store'
import App from './App'

import TwitchPlugin from '@/plugins/twitch'
import FoxApiPlugin from '@/plugins/fox-api'
import FirebasePlugin from '@/plugins/firebase'

import '@/styles/global.scss'

Vue.config.productionTip = false

Vue.use(firestorePlugin)
Vue.use(TwitchPlugin, { store })
const client = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  baseURL: 'https://localhost:3000/', // TODO: change it depending on prod/dev
})
Vue.use(FoxApiPlugin, { store, client })
Vue.use(FirebasePlugin, { store, client })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
