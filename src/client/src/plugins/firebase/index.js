import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { createStoreModule, UPDATE_USER_ACTION } from './store'
import authFactory from './auth'

export default function install(Vue, options) {
  const { store, client, authConfig, firebaseConfig } = options
  const db = firebase.initializeApp(firebaseConfig).firestore()
  const firebaseAuth = firebase.auth()

  store.registerModule('firebaseAuth', createStoreModule())
  Vue.prototype.$db = db
  const dbAuth = authFactory({ firebaseAuth, store, client, authConfig })
  Vue.prototype.$dbAuth = dbAuth

  firebaseAuth.onAuthStateChanged(async user => {
    const userInfo = await dbAuth.getUserInfo()
    store.dispatch(UPDATE_USER_ACTION, { user, userInfo })
  })
}
