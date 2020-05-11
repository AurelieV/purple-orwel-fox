import { firebaseConfig } from '@/../../config/firebaseClient.config'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default function(context, inject) {
  // Get a Firestore instance
  const db = firebase.initializeApp(firebaseConfig).firestore()
  const auth = firebase.auth()
  inject('db', db)
  inject('firebaseAuth', auth)
}
