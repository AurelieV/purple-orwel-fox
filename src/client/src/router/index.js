import Vue from 'vue'
import VueRouter from 'vue-router'

import Admin from '@/views/Admin'
import AuthentRedirect from '@/views/AuthentRedirect'
import CurrentQueue from '@/views/CurrentQueue'

const routes = [
  { path: '/admin', component: Admin, name: 'admin' },
  { path: '/admin/redirect', component: AuthentRedirect, name: 'redirect' },
  { path: '/queue/:channelId', component: CurrentQueue, name: 'current-queue' },
]

Vue.use(VueRouter)
export default new VueRouter({ routes, mode: 'history' })
