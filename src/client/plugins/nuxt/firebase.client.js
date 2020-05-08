import { firebaseConfig } from '@/../../config/firebaseClient.config'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default function(context, inject) {
  // Get a Firestore instance
  const db = firebase.initializeApp(firebaseConfig).firestore()
  inject('db', db)
}
