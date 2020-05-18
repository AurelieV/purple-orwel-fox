import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { firestorePlugin } from 'vuefire'

import router from './router'
import store from './store'
import App from './App'

import FoxApiPlugin from '@/plugins/fox-api'
import FirebasePlugin from '@/plugins/firebase'

import '@/styles/global.scss'

Vue.config.productionTip = false

Vue.use(firestorePlugin)
const client = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  baseURL: 'https://twitch-api.purple-fox.fr/', // TODO: change it depending on prod/dev
})
Vue.use(FirebasePlugin, { store, client })
Vue.use(FoxApiPlugin, { store, client, firebaseAuth: Vue.prototype.$dbAuth })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
