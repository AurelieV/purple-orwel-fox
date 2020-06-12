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
import NotificationsPlugin from '@/plugins/notifications'
import ResponsivePlugin from '@/plugins/responsive'

import '@/styles/global.scss'

Vue.config.productionTip = false

Vue.use(firestorePlugin)
const client = axios.create({
  baseURL: '/api',
})
Vue.use(FirebasePlugin, { store, client, firebaseConfig, authConfig })
Vue.use(FoxApiPlugin, { store, client, auth: Vue.prototype.$auth })
Vue.use(NotificationsPlugin, { store })
Vue.use(ResponsivePlugin)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
