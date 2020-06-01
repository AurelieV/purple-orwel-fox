import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { firestorePlugin } from 'vuefire'

import router from './router'
import store from './store'
import App from './App'

import { firebaseConfig, authConfig } from '@/../../../config/client.config'

import FoxApiPlugin from '@/plugins/fox-api'
import FirebasePlugin from '@/plugins/firebase'
import notificationsPlugin from '@/plugins/notifications'
import responsivePlugin from '@/plugins/responsive'

import '@/styles/global.scss'

Vue.config.productionTip = false

Vue.use(firestorePlugin)
const client = axios.create({
  baseURL: '/api',
})
Vue.use(FirebasePlugin, { store, client, firebaseConfig, authConfig })
Vue.use(FoxApiPlugin, { store, client, firebaseAuth: Vue.prototype.$dbAuth })
Vue.use(notificationsPlugin, { store })
Vue.use(responsivePlugin)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
