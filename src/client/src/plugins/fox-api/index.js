import { FoxApi } from './fox-api'

export default {
  install(Vue, { store, client }) {
    Vue.prototype.$foxApi = new FoxApi({ store, client })
  },
}
