import { background } from '@storybook/theming'

export default {
  install(Vue) {
    Vue.prototype.$router = {
      push: () => {},
    }
    Vue.prototype.$route = {
      name: '',
    }
  },
}
