import Vue from 'vue'
import VueRouter from 'vue-router'

import AuthentRedirect from '@/views/AuthentRedirect'
import Login from '@/views/Login'
import { IS_CONNECTED } from '@/plugins/firebase/store'

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

Vue.use(VueRouter)

function createRoutes({ store, auth }) {
  return [
    {
      path: '/login',
      component: Login,
      name: 'login',
      beforeEnter: async (to, from, next) => {
        await auth.isInitialized
        const isConnected = store.getters[IS_CONNECTED]
        isConnected ? next({ name: 'main' }) : next()
      },
    },
    { path: '/authent-redirect', component: AuthentRedirect, name: 'redirect' },
    {
      path: '/stream/:channelId',
      component: Stream,
      children: [
        { path: 'queue', component: CurrentQueue, name: 'current-queue' },
        { path: 'punt', component: Punt, name: 'punt' },
        { path: 'punt-counter', component: PuntCounter, name: 'punt-counter' },
        { path: 'track', component: CurrentTrack, name: 'track' },
      ],
    },
    {
      path: '/',
      component: Main,
      name: 'main',
      beforeEnter: async (to, from, next) => {
        await auth.isInitialized
        const isConnected = store.getters[IS_CONNECTED]
        if (isConnected) return next()
        window.localStorage.setItem('redirectPath', to.path)
        next({ name: 'login' })
      },
      children: [
        { path: '/old', component: Old },
        { path: '/:channelId/queue', component: Queue },
      ],
    },
  ]
}

export default function createRouter({ store, auth }) {
  const routes = createRoutes({ store, auth })
  return new VueRouter({ routes, mode: 'history' })
}
