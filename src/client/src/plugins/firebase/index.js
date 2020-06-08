import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { createStoreModule, UPDATE_USER_ACTION } from './store'
import Authentification from './auth'

export default function install(Vue, options) {
  const { store, client, authConfig, firebaseConfig } = options
  const db = firebase.initializeApp(firebaseConfig).firestore()
  const firebaseAuth = firebase.auth()

  store.registerModule('auth', createStoreModule())
  Vue.prototype.$db = db
  const auth = new Authentification({ firebaseAuth, store, client, authConfig })
  Vue.prototype.$auth = auth

  firebaseAuth.onAuthStateChanged(async user => {
    const userInfo = await auth.getUserInfo()
    store.dispatch(UPDATE_USER_ACTION, { user, userInfo })
  })
}
