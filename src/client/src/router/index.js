import Vue from 'vue'
import VueRouter from 'vue-router'

import AuthentRedirect from '@/views/AuthentRedirect'
import Login from '@/views/Login'
import { IS_CONNECTED } from '@/plugins/firebase/store'

// Main
import Main from '@/views/Main'
import Old from '@/views/Main/Old'
import Queue from '@/views/Main/Queue'
import Channel from '@/views/Main/Channel'
import Home from '@/views/Main/Home'

// Stream
import Stream from '@/views/Stream'
import CurrentQueue from '@/views/Stream/CurrentQueue'
import IconAnimation from '@/views/Stream/IconAnimation'
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
        isConnected ? next({ name: 'main-home' }) : next()
      },
    },
    { path: '/authent-redirect', component: AuthentRedirect, name: 'redirect' },
    {
      path: '/stream/:channelId',
      component: Stream,
      children: [
        { path: 'queue', component: CurrentQueue, name: 'current-queue' },
        { path: 'icon/:icon', component: IconAnimation, name: 'icon-animation' },
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
        { path: '/', component: Home, exact: true, name: 'main-home' },
        { path: '/old', component: Old },
        { path: '/:channelId/queue', component: Queue },
        { path: '/channel/:channelId', component: Channel, name: 'channel' },
      ],
    },
  ]
}

export default function createRouter({ store, auth }) {
  const routes = createRoutes({ store, auth })
  return new VueRouter({ routes, mode: 'history' })
}
