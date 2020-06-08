import { FoxApi } from './fox-api'

export default {
  install(Vue, { store, client, auth }) {
    Vue.prototype.$foxApi = new FoxApi({ store, client, auth })
  },
}
