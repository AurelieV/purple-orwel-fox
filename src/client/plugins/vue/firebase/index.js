import { createStoreModule, UPDATE_USER_ACTION } from './store'
import authFactory from './auth'

export default function install(Vue, options) {
  const { store, firebaseAuth, client } = options
  store.registerModule('firebaseAuth', createStoreModule())
  Vue.prototype.$dbAuth = authFactory({ firebaseAuth, store, client })

  if (!firebaseAuth) return

  firebaseAuth.onAuthStateChanged(user => {
    store.dispatch(UPDATE_USER_ACTION, user)
  })
}
