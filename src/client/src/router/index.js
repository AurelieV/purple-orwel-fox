import Vue from 'vue'
import VueRouter from 'vue-router'

import AuthentRedirect from '@/views/AuthentRedirect'

// Main
import Main from '@/views/Main'
import Old from '@/views/Main/Old'
import Queue from '@/views/Main/Queue'

// Stream
import Stream from '@/views/Stream'
import CurrentQueue from '@/views/Stream/CurrentQueue'
import Punt from '@/views/Stream/Punt'
import PuntCounter from '@/views/Stream/PuntCounter'
import CurrentTrack from '@/views/Stream/CurrentTrack'

const routes = [
  {
    path: '/',
    component: Main,
    name: 'main',
    children: [
      { path: '/old', component: Old },
      { path: '/:channelId/queue', component: Queue },
    ],
  },
  { path: '/authent-redirect', component: AuthentRedirect, name: 'redirect' },
  {
    path: '/stream/:channelId',
    component: Stream,
    children: [
      { path: '/queue', component: CurrentQueue, name: 'current-queue' },
      { path: '/punt', component: Punt, name: 'punt' },
      { path: '/punt-counter', component: PuntCounter, name: 'punt-counter' },
      { path: '/track', component: CurrentTrack, name: 'track' },
    ],
  },
]

Vue.use(VueRouter)
export default new VueRouter({ routes, mode: 'history' })
