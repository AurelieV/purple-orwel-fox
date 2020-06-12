import { addParameters } from '@storybook/vue'
import '@storybook/addon-console'

import Vue from 'vue'
import Vuex from 'vuex'

import NotifierPlugin from './fake-plugins/notifier'
import ResponsivePlugin from '@/plugins/responsive'

import '@/styles/global.scss'

Vue.use(Vuex)
Vue.use(NotifierPlugin)
Vue.use(ResponsivePlugin)

const store = new Vuex.Store({
  state() {
    return {
      auth: {
        uid: '1234',
        info: {
          name: 'ConnectedUser',
          profileImage:
            'https://static-cdn.jtvnw.net/jtv_user_pictures/d360942e-4f5b-402a-9d36-4a34cbda9964-profile_image-300x300.png',
        },
      },
    }
  },
})
Vue.options.store = store

addParameters({
  options: {
    showRoots: true,
  },
})
