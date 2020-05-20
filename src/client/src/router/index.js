import Vue from 'vue'
import VueRouter from 'vue-router'

import Admin from '@/views/Admin'
import AuthentRedirect from '@/views/AuthentRedirect'
import CurrentQueue from '@/views/CurrentQueue'
import Punt from '@/views/Punt'
import PuntCounter from '@/views/PuntCounter'
import CurrentTrack from '@/views/CurrentTrack'

const routes = [
  { path: '/admin', component: Admin, name: 'admin' },
  { path: '/admin/redirect', component: AuthentRedirect, name: 'redirect' },
  { path: '/queue/:channelId', component: CurrentQueue, name: 'current-queue' },
  { path: '/punt/:channelId', component: Punt, name: 'punt' },
  { path: '/punt-counter/:channelId', component: PuntCounter, name: 'punt-counter' },
  { path: '/track/:channelId', component: CurrentTrack, name: 'track' },
]

Vue.use(VueRouter)
export default new VueRouter({ routes, mode: 'history' })
