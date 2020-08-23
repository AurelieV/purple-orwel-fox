import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { firestorePlugin } from 'vuefire'

import createRouter from './router'
import store from './store'
import App from './App'
import PortalVue from 'portal-vue'

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
Vue.use(PortalVue)

new Vue({
  router: createRouter({ store, auth: Vue.prototype.$auth }),
  store,
  render: h => h(App),
}).$mount('#app')
