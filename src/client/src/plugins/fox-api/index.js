import { FoxApi } from './fox-api'

export default {
  install(Vue, { store, client, firebaseAuth }) {
    Vue.prototype.$foxApi = new FoxApi({ store, client, firebaseAuth })
  },
}
