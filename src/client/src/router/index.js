import Vue from 'vue'
import VueRouter from 'vue-router'

import Admin from '@/views/Admin'
import AuthentRedirect from '@/views/AuthentRedirect'

const routes = [
  { path: '/admin', component: Admin, name: 'admin' },
  { path: '/admin/redirect', component: AuthentRedirect, name: 'redirect' },
]

Vue.use(VueRouter)
export default new VueRouter({ routes, mode: 'history' })
