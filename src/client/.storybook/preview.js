import { addParameters } from '@storybook/vue'
import { themes } from '@storybook/theming'

import '@storybook/addon-console'

import Vue from 'vue'
import Vuex from 'vuex'

import NotifierPlugin from './fake-plugins/notifier'
import ResponsivePlugin from '@/plugins/responsive'

import '@/styles/global.scss'

Vue.use(Vuex)
Vue.use(NotifierPlugin)
Vue.use(ResponsivePlugin)

addParameters({
  options: {
    showRoots: true,
    theme: themes.dark,
  },
})
